const nodemailer = require('nodemailer')
const { EMAIL_APP_PASSWORD } = require('../config/config')
const logger = require('./logger')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bogdan.pechounov@gmail.com',
    pass: EMAIL_APP_PASSWORD,
  },
})

async function sendMail({ to, subject, text, html }) {
  try {
    let info = await transporter.sendMail({
      to,
      replyTo: 'noreply.bogdan.pechounov@gmail.com',
      subject,
      text,
      html,
    })
    logger.info(info)
  } catch (err) {
    logger.error(err)
  }
}

module.exports = sendMail
