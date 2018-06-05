const mongoose = require('mongoose')

const Image = require('../models/image')
const Fruit = require('../models/fruit')

exports.images_get_all = (req, res, next) => {
  Image.find()
    .select('_id fruit image')
    .populate('fruit', '_id name price fruitImage')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        images: docs.map(doc => {
          return {
            _id: doc._id,
            fruit: doc.fruit,
            image: doc.image
          }
        })
      })
    }).catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.images_post_image = (req, res, next) => {
  Fruit.findById(req.body.fruitId)
    .then(fruit => {
      if(!fruit){
        return res.status(404).json({
          message: 'Fruit not found'
        })
      }
      const image = new Image({
        _id: new mongoose.Types.ObjectId(),
        fruit: req.body.fruitId,
        image: req.file.path
      })
      return image.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Image stored'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}