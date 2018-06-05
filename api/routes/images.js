const express = require('express')
const router = express.Router()
const multer = require('multer')

const ImagesController = require('../controllers/images.js')

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})

router.get('/', ImagesController.images_get_all)

router.post('/', upload.single('image'), ImagesController.images_post_image)

module.exports = router