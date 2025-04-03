const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err.message))


app.use('/api/consultants/auth', require('./routes/consultantAuth'))
app.use('/api/consultants/dashboard', require('./routes/consultantDashboard'))
app.use('/api/consultants/availability', require('./routes/availability'))
app.use('/api/client/schedule', require('./routes/clientSchedule'))
app.use('/api/ecpay', require('./routes/ecpay'))
app.use('/api/google', require('./routes/googleCalendar'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/reviews', require('./routes/review'))
app.use('/api/consultants/transactions', require('./routes/consultantTransactions'))
app.use('/api/withdraw', require('./routes/withdraw'))
app.use('/api/admin/withdraws', require('./routes/adminWithdraw'))

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000')
})
