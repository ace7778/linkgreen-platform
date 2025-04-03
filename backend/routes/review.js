const express = require('express')
const router = express.Router()
const Review = require('../models/Review')

// 查詢顧問所有評價
router.get('/:consultantId', async (req, res) => {
  const reviews = await Review.find({ consultantId: req.params.consultantId }).sort({ createdAt: -1 })
  res.json(reviews)
})

// 新增評價
router.post('/:consultantId', async (req, res) => {
  const { name, comment, rating } = req.body
  const review = await Review.create({ consultantId: req.params.consultantId, name, comment, rating })
  res.status(201).json(review)
})

module.exports = router
