import { Transaction } from 'sequelize'
import db from '@/config/database'
import { Advertisement, AdvertisementImage } from '@/models'
import { saveBase64Image } from '@/utils/image'
import fs from 'fs'
import path from 'path'

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
				{ where: { id }, transaction: t },
			)

			// 0. Fetch current images
			const currentImages = await AdvertisementImage.findAll({
				where: { advertisement_id: id, deleted_at: null },
				transaction: t,
			})

			// 1. If no photos provided, delete all images
			if (data.photos.length === 0) {
				// Delete all files from disk
				for (const img of currentImages) {
					const filePath = path.join(AD_IMAGES_DIR, img.get('image'))
					const thumbPath = path.join(THUMB_DIR, img.get('image'))
					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath)
					}
					if (fs.existsSync(thumbPath)) {
						fs.unlinkSync(thumbPath)
					}
				}
				// Delete all image records from DB
				await AdvertisementImage.destroy({
					where: { advertisement_id: id },
					transaction: t,
				})
			}

			// If photos provided, handle mixed updates
			if (Array.isArray(data.photos) && data.photos.length > 0) {
				// 2. Separate URLs and base64 images from incoming data
				const existingUrls: string[] = []
				const newBase64Images: string[] = []

				data.photos.forEach((photo: string) => {
					if (photo.startsWith('data:image/')) {
						// Base64 image - new upload
						newBase64Images.push(photo)
					} else {
						// URL - existing image, extract filename
						const filename = path.basename(new URL(photo).pathname)
						existingUrls.push(filename)
					}
				})

				// 3. Find images to delete (current images not in existingUrls)
				const imagesToDelete = currentImages.filter(
					(img) => !existingUrls.includes(img.get('image')),
				)

				// 4. Delete old files from disk
				for (const img of imagesToDelete) {
					const filePath = path.join(AD_IMAGES_DIR, img.get('image'))
					const thumbPath = path.join(THUMB_DIR, img.get('image'))
					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath)
					}
					if (fs.existsSync(thumbPath)) {
						fs.unlinkSync(thumbPath)
					}
				}

				// 5. Delete old image records from DB
				if (imagesToDelete.length > 0) {
					const imageIdsToDelete = imagesToDelete.map(
						(img) => img?.get('id') || img.id,
					)
					await AdvertisementImage.destroy({
						where: { id: imageIdsToDelete },
						transaction: t,
					})
				}

				// 6. Save new base64 images
				if (newBase64Images.length > 0) {
					await Promise.all(
						newBase64Images.map(async (photo: string) => {
							const fileName = await saveBase64Image(photo)
							await AdvertisementImage.create(
								{
									advertisement_id: id,
									image: fileName,
								},
								{ transaction: t },
							)
						}),
					)
				}
			}

			await t.commit()
			return { message: 'Advertisement updated successfully' }
		} catch (error) {
			await t.rollback()
			throw error
		}
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
