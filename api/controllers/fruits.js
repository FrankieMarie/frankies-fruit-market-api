const mongoose = require('mongoose')

const Fruit = require('../models/fruit')

exports.fruits_get_all = (req, res, next) => {
  Fruit.find()
    .select('_id name price description fruitImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        fruits: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            description: doc.description,
            fruitImage: doc.fruitImage,
            request: {
              type: 'GET',
              url: 'http://localhost:8000/fruits/'+doc._id
            }
          }
        })
      }
      res.status(200).json(response)
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.fruits_create_fruit = (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
  const fruit = new Fruit({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: parseInt(req.body.price),
    description: req.body.description,
    fruitImage: req.file.path
  })
  fruit.save().then(result => {
    console.log(result)
    res.status(201).json({
      message: 'handling POST requests to /fruits',
      postedFruit: result
    })
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
}

exports.fruits_get_one = (req, res, next) => {
  const id = req.params.fruitId
  Fruit.findById(id)
    .select('_id name price description fruitImage')
    .exec()
    .then(doc => {
      console.log('From database', doc)
      if(doc){
        res.status(200).json(doc)
      }else{
        res.status(404).json({
          message: 'No valid entry found for provided ID'
        })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
}

exports.fruits_update_fruit = (req, res, next) => {
  const id = req.params.fruitId
  const updateOps = {}
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value
  }
  Fruit.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(result)
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.fruits_delete_fruit = (req, res, next) => {
  const id = req.params.fruitId
  Fruit.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Fruit deleted'
      })
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}