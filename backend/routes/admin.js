const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../models/Admin')
const Consultant = require('../models/Consultant')
const Schedule = require('../models/Schedule')
const Transaction = require('../models/Transaction')
const { verifyAdmin } = require('../middleware/adminMiddleware')

// 管理員登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email })
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: '帳號或密碼錯誤' })
  }
  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET)
  res.json({ token })
})



// 顧問清單
router.get('/consultants', verifyAdmin, async (req, res) => {
  const consultants = await Consultant.find().sort({ createdAt: -1 })
  res.json(consultants)
})

// 修改顧問狀態
router.patch('/consultants/:id/status', verifyAdmin, async (req, res) => {
  const { status } = req.body
  const updated = await Consultant.findByIdAndUpdate(req.params.id, { status }, { new: true })
  res.json(updated)
})

// 所有預約總覽
router.get('/schedules', verifyAdmin, async (req, res) => {
  const schedules = await Schedule.find().populate('consultantId').sort({ timeSlot: -1 })
  res.json(schedules)
})

// 所有交易總覽
router.get('/transactions', verifyAdmin, async (req, res) => {
  const txs = await Transaction.find().populate('consultantId scheduleId').sort({ createdAt: -1 })
  res.json(txs)
})

// 顧問分潤報表
router.get('/payouts', verifyAdmin, async (req, res) => {
  const consultants = await Consultant.find()
  const report = []

  for (const c of consultants) {
    const txs = await Transaction.find({ consultantId: c._id })
    const total = txs.reduce((sum, t) => sum + t.amount, 0)
    const share = total * 0.8

    report.push({
      consultantId: c._id,
      name: c.name,
      totalRevenue: total,
      consultantShare: share
    })
  }

  res.json(report)
})

module.exports = router
