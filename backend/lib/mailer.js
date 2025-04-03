const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text
  })
}

module.exports = sendEmail
