const mongoose = require('mongoose')

const consultantSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  expertise: String,
  bio: String,
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  availability: Object,
  googleTokens: Object,
  lineToken: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Consultant', consultantSchema)
