const jwt = require('jsonwebtoken')

exports.verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: '未授權' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin') return res.status(403).json({ error: '無管理權限' })
    req.admin = decoded
    next()
  } catch {
    res.status(403).json({ error: 'Token 錯誤' })
  }
}
