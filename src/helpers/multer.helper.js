const multer = require("multer")

module.exports = (limit = 1) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/images'),
    filename: (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
  })

  const limits = { fileSize: limit * 1000 * 1000 }

  const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      return cb(new Error("Extension not allowed"), false)

    cb(null, true)
  }

  return multer({ storage, limits, fileFilter })
} 