const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
  name: String,
  comment: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', reviewSchema)
