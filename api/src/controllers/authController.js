const User = require('../models/user')
const {
  createAccessToken,
  createRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearCookie,
} = require('../utils/tokens')
const sendMail = require('../utils/mail')
const logger = require('../utils/logger')
const { matchPassword } = require('../utils/password')

exports.me = async (req, res) => {
  res.send(await User.findById(req.userId))
}

exports.logout = (req, res) => {
  clearCookie(res)
  res.send('Logged out')
}

exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const user = await new User({ name, email, password, confirmPassword }).save()

  //JWT
  setAccessToken(res, createAccessToken(user._id))
  setRefreshToken(res, createRefreshToken(user._id))
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
      setAccessToken(res, createAccessToken(user._id))
      setRefreshToken(res, createRefreshToken(user._id))
      res.send(user)
    } else {
      res.status(401).send('Incorrect password')
    }
  } else {
    res.status(404).send('User not found')
  }
}

//todo reset password
