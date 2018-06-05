const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fruit: {type: mongoose.Schema.Types.ObjectId, ref: 'Fruit', required: true},
  image: {type: String, required: true}
})

module.exports = mongoose.model('Image', imageSchema)