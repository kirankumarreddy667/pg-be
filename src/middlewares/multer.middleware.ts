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

export const uploadCSV = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      cb(new Error('Only CSV files are allowed'))
    } else {
      cb(null, true)
    }
  },
})
