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
