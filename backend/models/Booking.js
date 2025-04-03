// models/Booking.js
const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  timeSlot: { type: Date, required: true },
  contactInfo: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true })

module.exports = mongoose.model('Booking', BookingSchema)
