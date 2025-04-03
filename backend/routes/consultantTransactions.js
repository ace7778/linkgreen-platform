const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')
const auth = require('../middleware/authMiddleware')

router.get('/', auth, async (req, res) => {
  const txs = await Transaction.find({ consultantId: req.user._id }).populate('scheduleId').sort({ createdAt: -1 })
  res.json(txs)
})

module.exports = router
