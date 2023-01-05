const User = require('../models/user')
const {
  createAccessToken,
  createRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearCookie,
  getRefreshToken,
} = require('../utils/tokens')
const sendMail = require('../utils/mail')
const logger = require('../utils/logger')
const { matchPassword } = require('../utils/password')
const { REFRESH_TOKEN_SECRET, ORIGIN } = require('../config/config')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

async function deleteRefreshToken(userId, refreshToken) {
  await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: refreshToken } }
  )
}

async function addRefreshToken(userId, refreshToken) {
  await User.updateOne(
    { _id: userId },
    { $push: { refreshTokens: refreshToken } }
  )
}

exports.me = async (req, res) => {
  res.send(await User.findById(req.userId))
}

exports.logout = async (req, res) => {
  //delete refresh token
  const refreshToken = getRefreshToken(req)
  try {
    const { id } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    await deleteRefreshToken(id, refreshToken)
    //clear cookie
    clearCookie(res)
    res.send('Logged out')
  } catch (err) {
    //clear cookie
    clearCookie(res)
    res.status(401).send('Invalid token')
  }
}

exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const user = await new User({ name, email, password, confirmPassword }).save()

  //JWT
  const refreshToken = createRefreshToken(user._id)
  addRefreshToken(user._id, refreshToken)
  setRefreshToken(res, refreshToken)
  setAccessToken(res, createAccessToken(user._id))
  //email
  if (email) sendMail({ to: email, subject: 'Sign up succeeded' })

  res.status(201).send(user)
}

exports.login = async (req, res) => {
  const { name, email, password } = req.body
  let user
  if (name) user = await User.findOne({ name })
  else if (email) user = await User.findOne({ email })
  if (user) {
    if (await matchPassword(password, user.hashedPassword)) {
      //JWT
      const refreshToken = createRefreshToken(user._id)
      addRefreshToken(user._id, refreshToken)
      setRefreshToken(res, refreshToken)
      setAccessToken(res, createAccessToken(user._id))
      //delete expired tokens
      user.refreshTokens = user.refreshTokens.filter((token) => {
        try {
          jwt.verify(token, REFRESH_TOKEN_SECRET)
          return true
        } catch (err) {
          return false
        }
      })
      user.save()
      res.send(user)
    } else {
      res.status(401).send('Incorrect password')
    }
  } else {
    res.status(404).send('User not found')
  }
}

exports.requestNewPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).send('No account with that email found')
  }
  //generate random string
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) throw err
    const token = buffer.toString('hex')
    const expiration = Date.now() + 1000 * 60 * 60
    user.resetPassword = { token, expiration }
    await user.save()
    sendMail({
      to: email,
      subject: 'Password Reset',
      html: `
      <p>You requested a new password</p>
      <p>Click this <a href="${ORIGIN}/reset-password/${token}">link</a> to set a new password.</p>
    `,
    })
    res.send('Email sent')
  })
}

exports.resetPassword = async (req, res) => {
  const { token, password = '', confirmPassword } = req.body
  //find token that hasn't expired
  const user = await User.findOne({
    'resetPassword.token': token,
    'resetPassword.expiration': { $gt: Date.now() },
  })
  if (!user) {
    return res.status(400).send({ token: 'Token not found' })
  }
  user.password = password
  user.confirmPassword = confirmPassword
  user.resetPassword = undefined
  await user.save()
  res.send('Password has been reset')
}
