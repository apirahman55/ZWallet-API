
const upload = require("../helpers/multer.helper")


const multerHandling = (req, res, next) => {
  const uploadImage = upload(4).single("photo")
  uploadImage(req, res, (err) => {
    console.log(err.message)
  })
}

module.exports = multerHandling