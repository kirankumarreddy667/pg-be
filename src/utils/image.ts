import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import crypto from 'crypto'

const AD_IMAGES_DIR = path.join(process.cwd(), 'public', 'ad_images')
const THUMB_DIR = path.join(AD_IMAGES_DIR, 'thumb')

export async function saveBase64Image(base64: string): Promise<string> {
	if (!fs.existsSync(AD_IMAGES_DIR))
		fs.mkdirSync(AD_IMAGES_DIR, { recursive: true })
	if (!fs.existsSync(THUMB_DIR)) fs.mkdirSync(THUMB_DIR, { recursive: true })

		
	// Extract mime and data
	const regex = /^data:(image\/(png|jpeg|jpg));base64,(.+)$/
	const matches = regex.exec(base64)
	if (!matches) throw new Error('Invalid base64 image')
	const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2]
	const buffer = Buffer.from(matches[3], 'base64')
	const randomPart = crypto.randomInt(1e9)
	const fileName = `${Date.now()}-${randomPart}.${ext}`
	const filePath = path.join(AD_IMAGES_DIR, fileName)
	const thumbPath = path.join(THUMB_DIR, fileName)

	// Save full image
	await fs.promises.writeFile(filePath, buffer)
	// Create and save thumbnail
	await sharp(buffer).resize(72, 82).toFile(thumbPath)

	return fileName
}
