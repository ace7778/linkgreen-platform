const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
  amount: Number,
  tradeNo: String,
  paymentType: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Transaction', transactionSchema)
