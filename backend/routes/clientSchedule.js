const express = require('express')
const router = express.Router()
const Schedule = require('../models/Schedule')
const Consultant = require('../models/Consultant')
const sendEmail = require('../lib/mailer')
const sendLineNotify = require('../lib/lineNotify')

router.post('/query', async (req, res) => {
  const { contactInfo } = req.body
  const schedules = await Schedule.find({ contactInfo }).populate('consultantId')
  res.json(schedules)
})

router.delete('/:id/cancel', async (req, res) => {
  const schedule = await Schedule.findById(req.params.id).populate('consultantId')
  if (!schedule) return res.status(404).json({ error: '預約不存在' })

  const now = new Date()
  const slotTime = new Date(schedule.timeSlot)
  const diffHours = (slotTime - now) / (1000 * 60 * 60)
  if (diffHours < 3) return res.status(400).json({ error: '預約時間過近，無法取消' })

  schedule.status = 'cancelled'
  await schedule.save()

  const consultant = schedule.consultantId
  const time = slotTime.toLocaleString()

  if (consultant?.email) {
    await sendEmail({
      to: consultant.email,
      subject: '預約取消通知',
      text: `客戶 ${schedule.clientName} 已取消 ${time} 的預約`
    })
  }

  if (consultant?.lineToken) {
    await sendLineNotify(`提醒：${schedule.clientName} 取消了 ${time} 的預約`, consultant.lineToken)
  }

  if (schedule.contactInfo.includes('@')) {
    await sendEmail({
      to: schedule.contactInfo,
      subject: '預約取消確認',
      text: `您已成功取消與 ${consultant.name} 於 ${time} 的預約`
    })
  }

  res.json({ message: '預約已取消' })
})

module.exports = router
