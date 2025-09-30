import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, path.join(process.cwd(), 'public', 'CSVFile'))
	},
	filename: function (_req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	},
})

const MAX_CSV_SIZE = 10 * 1024 * 1024 // 10 MB
export const uploadCSV = multer({
	storage,
	limits: {
		fileSize: MAX_CSV_SIZE,
	},
	fileFilter: (_req, file, cb) => {
		if (file.mimetype === 'text/csv') {
			cb(null, true)
		} else {
			cb(new Error('Only CSV files are allowed'))
		}
	},
})

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
export const uploadAnimalImage = multer({
	storage: multer.diskStorage({
		destination: function (_req, _file, cb) {
			cb(null, path.join(process.cwd(), 'public', 'profile_img'))
		},
		filename: function (_req, file, cb) {
			// Generate random string like PHP's str_random(50)
			const randomString = crypto.randomBytes(25).toString('hex') // 50 chars
			const extension = path.extname(file.originalname).toLowerCase()
			cb(null, `${randomString}${extension}`)
		},
	}),
	limits: {
		fileSize: MAX_IMAGE_SIZE,
	},
	fileFilter: (_req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
		} else {
			cb(new Error('Only image files are allowed'))
		}
	},
})
