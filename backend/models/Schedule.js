const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
  clientName: String,
  contactInfo: String,
  timeSlot: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' }
})

module.exports = mongoose.model('Schedule', scheduleSchema)
