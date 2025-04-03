const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Consultant = require('../models/Consultant')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password, name, expertise, bio } = req.body
  const existing = await Consultant.findOne({ email })
  if (existing) return res.status(400).json({ error: 'Email 已註冊' })
  const hashed = await bcrypt.hash(password, 10)
  const newConsultant = await Consultant.create({ email, password: hashed, name, expertise, bio })
  res.status(201).json({ message: '註冊成功，待審核', consultant: newConsultant })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const consultant = await Consultant.findOne({ email })
  if (!consultant || !(await bcrypt.compare(password, consultant.password))) {
    return res.status(401).json({ error: '帳號或密碼錯誤' })
  }
  const token = jwt.sign({ id: consultant._id, role: 'consultant' }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, consultant })
})

module.exports = router
