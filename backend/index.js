// index.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
const adminRoutes = require('./routes/admin')
const consultantRoutes = require('./routes/consultants')
const googleRoutes = require('./routes/googleCalendar')
const bookingRoutes = require('./routes/bookings') // ✅ 您剛建立的 API

app.use('/api/admin', adminRoutes)
app.use('/api/consultants', consultantRoutes)
app.use('/api/google', googleRoutes)
app.use('/api/bookings', bookingRoutes) // ✅ 掛上 Booking 模組

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 已連線')
    app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`))
  })
  .catch(err => console.error('❌ MongoDB 連線失敗:', err.message))
