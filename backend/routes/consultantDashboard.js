const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const Consultant = require('../models/Consultant')
const Schedule = require('../models/Schedule')

router.get('/me', auth, async (req, res) => {
  res.json(req.user)
})

router.patch('/me', auth, async (req, res) => {
  const { name, bio, expertise } = req.body
  const updated = await Consultant.findByIdAndUpdate(req.user._id, { name, bio, expertise }, { new: true })
  res.json(updated)
})

router.get('/schedules', auth, async (req, res) => {
  const schedules = await Schedule.find({ consultantId: req.user._id }).sort({ timeSlot: -1 })
  res.json(schedules)
})

module.exports = router
