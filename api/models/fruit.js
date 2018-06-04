const mongoose = require('mongoose')

const fruitSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  price: {type: Number, required: true},
  description: String,
  fruitImage: {type: String}
})

module.exports = mongoose.model('Fruit', fruitSchema)