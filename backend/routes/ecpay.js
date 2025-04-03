const express = require('express')
const router = express.Router()
const ecpay = require('ecpay_payment_nodejs')
const Schedule = require('../models/Schedule')
const Consultant = require('../models/Consultant')
const Transaction = require('../models/Transaction')
const sendEmail = require('../lib/mailer')
const sendLineNotify = require('../lib/lineNotify')

const options = {
  OperationMode: 'Test',
  MerchantID: process.env.ECPAY_MERCHANT_ID,
  HashKey: process.env.ECPAY_HASH_KEY,
  HashIV: process.env.ECPAY_HASH_IV,
  ReturnURL: process.env.BASE_URL + '/api/ecpay/callback'
}
const create = new ecpay(options).payment_client

router.post('/checkout', async (req, res) => {
  const { consultantId, clientName, contactInfo, timeSlot, price } = req.body
  const tradeNo = 'LG' + Date.now()
  const param = {
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: new Date().toLocaleString('zh-TW', { hour12: false }),
    TotalAmount: price,
    TradeDesc: '顧問預約',
    ItemName: `顧問預約`,
    ReturnURL: options.ReturnURL,
    ChoosePayment: 'ALL',
    CustomField1: JSON.stringify({ consultantId, clientName, contactInfo, timeSlot })
  }
  const html = create.payment(param)
  res.send(html)
})

router.post('/callback', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const data = req.body
    const custom = JSON.parse(data.CustomField1)
    const { consultantId, clientName, contactInfo, timeSlot } = custom

    const schedule = await Schedule.create({
      consultantId, clientName, contactInfo, timeSlot, status: 'confirmed'
    })

    await Transaction.create({
      consultantId,
      scheduleId: schedule._id,
      amount: Number(data.TradeAmt),
      tradeNo: data.MerchantTradeNo,
      paymentType: data.PaymentType
    })

    const consultant = await Consultant.findById(consultantId)
    const time = new Date(timeSlot).toLocaleString()

    if (consultant?.email) {
      await sendEmail({ to: consultant.email, subject: '新預約通知', text: `您有新的預約：${clientName}，時間：${time}` })
    }
    if (consultant?.lineToken) {
      await sendLineNotify(`提醒：${time} 有新的預約 - ${clientName}`, consultant.lineToken)
    }
    if (contactInfo.includes('@')) {
      await sendEmail({ to: contactInfo, subject: '預約成功通知', text: `您已成功預約顧問 ${consultant.name}，時間：${time}` })
    }

    res.send('1|OK')
  } catch {
    res.status(400).send('0|FAIL')
  }
})

module.exports = router
