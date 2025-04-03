const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')
const Withdraw = require('../models/Withdraw')
const auth = require('../middleware/authMiddleware')

router.post('/request', auth, async (req, res) => {
  const txs = await Transaction.find({ consultantId: req.user._id })
  const total = txs.reduce((sum, t) => sum + t.amount * 0.8, 0)
  const existing = await Withdraw.findOne({ consultantId: req.user._id, status: 'pending' })
  if (existing) return res.status(400).json({ error: '已有待處理提領申請' })

  const request = await Withdraw.create({
    consultantId: req.user._id,
    amount: total,
    status: 'pending'
  })

  res.status(201).json(request)
})

router.get('/history', auth, async (req, res) => {
  const records = await Withdraw.find({ consultantId: req.user._id }).sort({ createdAt: -1 })
  res.json(records)
})

module.exports = router
