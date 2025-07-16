import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, path.join(process.cwd(), 'uploads'))
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
		if (file.mimetype !== 'text/csv') {
			cb(new Error('Only CSV files are allowed'))
		} else {
			cb(null, true)
		}
	},
})

const MAX_IMAGE_SIZE = 3 * 1024 * 1024 // 3 MB
export const uploadAnimalImage = multer({
	storage: multer.diskStorage({
		destination: function (_req, _file, cb) {
			cb(null, path.join(process.cwd(), 'public', 'profile_img'))
		},
		filename: function (_req, file, cb) {
			cb(null, `${Date.now()}-${file.originalname}`)
		},
	}),
	limits: {
		fileSize: MAX_IMAGE_SIZE,
	},
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			cb(new Error('Only image files are allowed'))
		} else {
			cb(null, true)
		}
	},
})
