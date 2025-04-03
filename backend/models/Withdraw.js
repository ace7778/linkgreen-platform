const mongoose = require('mongoose')

const withdrawSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
  amount: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date
})

module.exports = mongoose.model('Withdraw', withdrawSchema)
