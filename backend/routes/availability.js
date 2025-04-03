const express = require('express')
const router = express.Router()
const Consultant = require('../models/Consultant')
const Schedule = require('../models/Schedule')
const auth = require('../middleware/authMiddleware')

router.post('/set', auth, async (req, res) => {
  const { availability } = req.body
  const updated = await Consultant.findByIdAndUpdate(req.user._id, { availability }, { new: true })
  res.json(updated)
})

router.get('/:id/availability', async (req, res) => {
  const consultant = await Consultant.findById(req.params.id)
  const now = new Date()
  const slots = []

  for (let i = 0; i < 14; i++) {
    const date = new Date()
    date.setDate(now.getDate() + i)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const availableTimes = consultant.availability?.[dayName] || []

    for (const time of availableTimes) {
      const [hh, mm] = time.split(':')
      const slotTime = new Date(date)
      slotTime.setHours(hh, mm, 0, 0)
      const exists = await Schedule.exists({ consultantId: consultant._id, timeSlot: slotTime })
      if (!exists && slotTime > now) slots.push({ time: slotTime })
    }
  }

  res.json(slots)
})

module.exports = router
