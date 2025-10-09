import { Transaction } from 'sequelize'
import db from '@/config/database'
import { Advertisement, AdvertisementImage } from '@/models'
import { saveBase64Image } from '@/utils/image'
import fs from 'node:fs'
import path from 'node:path'

const { sequelize } = db

const APP_URL = process.env.APP_URL || 'http://localhost:8888'
const AD_IMAGES_DIR = path.join(process.cwd(), 'public', 'ad_images')
const THUMB_DIR = path.join(AD_IMAGES_DIR, 'thumb')

interface AdvertisementPayload {
	name: string
	description: string
	cost: number
	phone_number: string
	term_conditions: string
	website_link?: string | null
	status: boolean
	photos: string[]
}

interface AdvertisementImageInstance {
	id: number
	advertisement_id: number
	image: string
	deleted_at: Date | null
	get(
		key: 'id' | 'advertisement_id' | 'image' | 'deleted_at',
	): string | number | Date | null
}

interface AdvertisementWithImages {
	id: number
	name: string
	description: string
	cost: number
	phone_number: string
	term_conditions: string
	website_link?: string | null
	status: number
	images: string[]
}

export class AdvertisementService {
	static async create(
		data: AdvertisementPayload,
	): Promise<{ message: string }> {
		const t: Transaction = await sequelize.transaction()
		try {
			const ad = await Advertisement.create(
				{
					name: data.name,
					description: data.description,
					cost: data.cost,
					phone_number: data.phone_number,
					term_conditions: data.term_conditions,
					website_link: data.website_link ?? null,
					status: data.status ? 1 : 0,
				},
				{ transaction: t },
			)

			if (Array.isArray(data.photos) && data.photos.length > 0) {
				await Promise.all(
					data.photos.map(async (photo) => {
						const fileName = await saveBase64Image(photo)
						await AdvertisementImage.create(
							{
								advertisement_id: ad.id,
								image: fileName,
							},
							{ transaction: t },
						)
					}),
				)
			}

			await t.commit()
			return { message: 'Advertisement added successfully' }
		} catch (error) {
			await t.rollback()
			throw error
		}
	}

	static async findAll(
		status: number | undefined,
	): Promise<AdvertisementWithImages[]> {
		//add a status filer for active ads
		let where = {}
		if (status === 1 || status === 0) {
			where = {
				status,
				deleted_at: null,
			}
		} else {
			where = {
				deleted_at: null,
			}
		}

		const ads = await Advertisement.findAll({
			include: [
				{
					model: AdvertisementImage,
					as: 'images',
					where: { deleted_at: null },
				},
			],
			where,
		})

		return ads.map((ad) => {
			const plainAd = ad.get({ plain: true }) as {
				id: number
				name: string
				description: string
				cost: number
				phone_number: string
				term_conditions: string
				website_link?: string | null
				status: number
				images?: { image: string }[]
			}
			return {
				id: plainAd.id,
				name: plainAd.name,
				description: plainAd.description,
				cost: plainAd.cost,
				phone_number: plainAd.phone_number,
				term_conditions: plainAd.term_conditions,
				website_link: plainAd.website_link,
				status: plainAd.status,
				images: Array.isArray(plainAd.images)
					? plainAd.images.map((img) => `${APP_URL}/ad_images/${img.image}`)
					: [],
			}
		})
	}

	static async findById(id: number): Promise<AdvertisementWithImages | null> {
		const ad = await Advertisement.findOne({
			where: { id, deleted_at: null },
			include: [
				{
					model: AdvertisementImage,
					as: 'images',
					where: { deleted_at: null },
				},
			],
		})
		if (!ad) {
			return null
		}

		const plainAd = ad.get({ plain: true }) as {
			id: number
			name: string
			description: string
			cost: number
			phone_number: string
			term_conditions: string
			website_link?: string | null
			status: number
			images?: { image: string }[]
		}

		return {
			id: plainAd.id,
			name: plainAd.name,
			description: plainAd.description,
			cost: plainAd.cost,
			phone_number: plainAd.phone_number,
			term_conditions: plainAd.term_conditions,
			website_link: plainAd.website_link,
			status: plainAd.status,
			images: Array.isArray(plainAd.images)
				? plainAd.images.map((img) => `${APP_URL}/ad_images/${img.image}`)
				: [],
		}
	}

	static async update(
		id: number,
		data: AdvertisementPayload,
	): Promise<{ message: string }> {
		const t = await sequelize.transaction()
		try {
			await AdvertisementService.updateAdvertisementDetails(id, data, t)
			await AdvertisementService.handleImageUpdates(id, data, t)

			await t.commit()
			return { message: 'Advertisement updated successfully' }
		} catch (error) {
			await t.rollback()
			throw error
		}
	}

	private static async updateAdvertisementDetails(
		id: number,
		data: AdvertisementPayload,
		transaction: Transaction,
	): Promise<void> {
		await db.Advertisement.update(
			{
				name: data.name,
				description: data.description,
				cost: data.cost,
				phone_number: data.phone_number,
				term_conditions: data.term_conditions,
				website_link: data.website_link,
				status: data.status ? 1 : 0,
			},
			{ where: { id }, transaction },
		)
	}

	private static async handleImageUpdates(
		id: number,
		data: AdvertisementPayload,
		transaction: Transaction,
	): Promise<void> {
		const currentImages = await AdvertisementService.getCurrentImages(
			id,
			transaction,
		)

		if (data.photos.length === 0) {
			await AdvertisementService.deleteAllImages(currentImages, id, transaction)
			return
		}

		if (Array.isArray(data.photos) && data.photos.length > 0) {
			await AdvertisementService.handleMixedImageUpdates(
				id,
				data.photos,
				currentImages,
				transaction,
			)
		}
	}

	private static async getCurrentImages(
		id: number,
		transaction: Transaction,
	): Promise<AdvertisementImageInstance[]> {
		return (await AdvertisementImage.findAll({
			where: { advertisement_id: id, deleted_at: null },
			transaction,
		})) as unknown as AdvertisementImageInstance[]
	}

	private static async deleteAllImages(
		currentImages: AdvertisementImageInstance[],
		advertisementId: number,
		transaction: Transaction,
	): Promise<void> {
		// Delete all files from disk
		for (const img of currentImages) {
			AdvertisementService.deleteImageFiles(img.get('image') as string)
		}

		// Delete all image records from DB
		await AdvertisementImage.destroy({
			where: { advertisement_id: advertisementId },
			transaction,
		})
	}

	private static async handleMixedImageUpdates(
		advertisementId: number,
		photos: string[],
		currentImages: AdvertisementImageInstance[],
		transaction: Transaction,
	): Promise<void> {
		const { existingUrls, newBase64Images } =
			AdvertisementService.categorizePhotos(photos)

		await AdvertisementService.deleteObsoleteImages(
			currentImages,
			existingUrls,
			advertisementId,
			transaction,
		)
		await AdvertisementService.saveNewImages(
			advertisementId,
			newBase64Images,
			transaction,
		)
	}

	private static categorizePhotos(photos: string[]): {
		existingUrls: string[]
		newBase64Images: string[]
	} {
		const existingUrls: string[] = []
		const newBase64Images: string[] = []

		for (const photo of photos) {
			if (photo.startsWith('data:image/')) {
				newBase64Images.push(photo)
			} else {
				const filename = path.basename(new URL(photo).pathname)
				existingUrls.push(filename)
			}
		}

		return { existingUrls, newBase64Images }
	}

	private static async deleteObsoleteImages(
		currentImages: AdvertisementImageInstance[],
		existingUrls: string[],
		advertisementId: number,
		transaction: Transaction,
	): Promise<void> {
		const imagesToDelete = currentImages.filter(
			(img) => !existingUrls.includes(img.get('image') as string),
		)

		// Delete files from disk
		for (const img of imagesToDelete) {
			AdvertisementService.deleteImageFiles(img.get('image') as string)
		}

		// Delete records from DB
		if (imagesToDelete.length > 0) {
			const imageIdsToDelete = imagesToDelete.map(
				(img) => img.get('id') as number,
			)
			await AdvertisementImage.destroy({
				where: { id: imageIdsToDelete },
				transaction,
			})
		}
	}

	private static deleteImageFiles(imageName: string): void {
		const filePath = path.join(AD_IMAGES_DIR, imageName)
		const thumbPath = path.join(THUMB_DIR, imageName)

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath)
		}
		if (fs.existsSync(thumbPath)) {
			fs.unlinkSync(thumbPath)
		}
	}

	private static async saveNewImages(
		advertisementId: number,
		newBase64Images: string[],
		transaction: Transaction,
	): Promise<void> {
		if (newBase64Images.length === 0) return

		await Promise.all(
			newBase64Images.map(async (photo: string) => {
				const fileName = await saveBase64Image(photo)
				await AdvertisementImage.create(
					{
						advertisement_id: advertisementId,
						image: fileName,
					},
					{ transaction },
				)
			}),
		)
	}

	static async status(
		id: number,
		status: number,
	): Promise<{ message: string }> {
		const t = await sequelize.transaction()
		try {
			await db.Advertisement.update(
				{ status },
				{ where: { id }, transaction: t },
			)
			await t.commit()
			return { message: 'Status updated successfully' }
		} catch (error) {
			await t.rollback()
			throw error
		}
	}

	static async delete(id: number): Promise<{ message: string }> {
		const t = await sequelize.transaction()
		try {
			// 1. Fetch all images for the ad
			const images = await AdvertisementImage.findAll({
				where: { advertisement_id: id },
				transaction: t,
			})
			// 2. Delete image files from disk
			for (const img of images) {
				const filePath = path.join(AD_IMAGES_DIR, img.get('image'))
				const thumbPath = path.join(THUMB_DIR, img.get('image'))
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath)
				}
				if (fs.existsSync(thumbPath)) {
					fs.unlinkSync(thumbPath)
				}
			}
			// 3. Hard delete all image records
			await AdvertisementImage.destroy({
				where: { advertisement_id: id },
				transaction: t,
			})
			// 4. Hard delete the advertisement record
			const deleted = await Advertisement.destroy({
				where: { id },
				transaction: t,
			})

			if (deleted) {
				await t.commit()
				return { message: 'Advertisement deleted successfully' }
			} else {
				await t.rollback()
				throw new Error('Something went wrong. Please try again')
			}
		} catch (error) {
			await t.rollback()
			throw error
		}
	}
}
