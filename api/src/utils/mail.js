const nodemailer = require('nodemailer')
const { EMAIL_APP_PASSWORD } = require('../config')
const logger = require('./logger')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bogdan.pechounov@gmail.com',
    pass: EMAIL_APP_PASSWORD,
  },
})

async function sendMail(to, text) {
  try {
    let info = await transporter.sendMail({
      to,
      replyTo: 'noreply.bogdan.pechounov@gmail.com',
      subject: 'Signup succeeded',
      text,
    })
    logger.info(info)
  } catch (err) {
    logger.error(err)
  }
}

module.exports = sendMail
