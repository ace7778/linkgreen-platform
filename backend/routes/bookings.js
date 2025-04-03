// routes/bookings.js
const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const Consultant = require('../models/Consultant')
const auth = require('../middleware/authMiddleware')

// Helper function for consistent responses
const sendResponse = (res, status, success, message, data = null) => {
  res.status(status).json({ success, message, data })
}

// Create booking route
router.post('/', auth, async (req, res) => {
  try {
    const { consultantId, timeSlot, contactInfo } = req.body
    const clientId = req.user._id // Use authenticated user's ID
    const clientName = req.user.name // Assuming user's name is stored in req.user

    // Validate required fields
    if (!consultantId || !timeSlot || !contactInfo) {
      return sendResponse(res, 400, false, '欄位不完整，請確認所有欄位皆已填寫')
    }

    // Check if consultant exists
    const consultant = await Consultant.findById(consultantId)
    if (!consultant) {
      return sendResponse(res, 404, false, '顧問不存在')
    }

    // Prevent double-booking
    const existingBooking = await Booking.findOne({ consultantId, timeSlot })
    if (existingBooking) {
      return sendResponse(res, 409, false, '此時段已被預約，請選擇其他時間')
    }

    // Create new booking
    const newBooking = await Booking.create({
      consultantId,
      clientId,
      clientName,
      timeSlot,
      contactInfo,
      status: 'pending'
    })

    sendResponse(res, 201, true, '預約成功', newBooking)
  } catch (err) {
    console.error('Booking error:', err.message)
    sendResponse(res, 500, false, '系統錯誤，請稍後再試')
  }
})

module.exports = router