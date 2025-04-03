const jwt = require('jsonwebtoken')
const Consultant = require('../models/Consultant')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: '未授權' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const consultant = await Consultant.findById(decoded.id)
    if (!consultant) return res.status(401).json({ error: '帳號不存在' })
    req.user = consultant
    next()
  } catch {
    res.status(403).json({ error: 'Token 無效' })
  }
}
