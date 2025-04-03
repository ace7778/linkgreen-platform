const express = require('express')
const router = express.Router()
const Withdraw = require('../models/Withdraw')
const { verifyAdmin } = require('../middleware/adminMiddleware')

router.get('/', verifyAdmin, async (req, res) => {
  const records = await Withdraw.find().populate('consultantId').sort({ createdAt: -1 })
  res.json(records)
})

router.patch('/:id', verifyAdmin, async (req, res) => {
  const { status } = req.body
  const updated = await Withdraw.findByIdAndUpdate(req.params.id, {
    status,
    reviewedAt: new Date()
  }, { new: true })
  res.json(updated)
})

module.exports = router
