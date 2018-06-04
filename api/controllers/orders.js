const mongoose = require('mongoose')

const Order = require('../models/order')
const Fruit = require('../models/fruit')

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('fruit quantity _id')
    .populate('fruit', '_id name price fruitImage')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            fruit: doc.fruit,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:8000/orders/'+doc._id
            }
          }
        })
      })
    }).catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_create_order = (req, res, next) => {
  Fruit.findById(req.body.fruitId)
    .then(fruit => {
      if(!fruit){
        return res.status(404).json({
          message: 'Fruit not found'
        })
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        fruit: req.body.fruitId,
        quantity: req.body.quantity
      })
      return order.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          fruit: result.fruit,
          quantity: result.quantity
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_get_one = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('fruit', '_id name price')
    .exec()
    .then(order => {
      if(!order){
        return res.status(404).json({
          message: 'Order not found'
        })
      }
      res.status(200).json({
        message: 'order details',
        order: order
      })
    }).catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.orders_delete_order = (req, res, next) => {
  Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'order deleted',
        orderId: req.params.orderId
      })
    })
}