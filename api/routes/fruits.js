const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const FruitsController = require('../controllers/fruits')

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})

router.get('/', FruitsController.fruits_get_all)

router.post('/', checkAuth, upload.single('fruitImage'), FruitsController.fruits_create_fruit)

router.get('/:fruitId', FruitsController.fruits_get_one)

router.patch('/:fruitId', checkAuth, FruitsController.fruits_update_fruit)

router.delete('/:fruitId', checkAuth, FruitsController.fruits_delete_fruit)

module.exports = router