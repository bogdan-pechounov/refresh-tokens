const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config')
const logger = require('../utils/logger')

const router = express.Router()

function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)
  console.log(authHeader)
  const token = authHeader.split(' ')[1]
  console.log(token)
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403) //invalid token
    req.user = decoded.id
    next()
  })
}

function verifyCookie(req, res, next) {
  const { accessToken, refreshToken } = req.cookies
  if (accessToken) {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.sendStatus(403)
      }
      next()
    })
  } else {
    res.sendStatus(401)
  }
}
router.get('/', verifyCookie, async (req, res) => {
  res.status(202).send(await User.find())
})

router.post('/signup', async (req, res) => {
  try {
    const user = await new User(req.body).save()

    //JWT
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    // res.json({ accessToken })  TODO use header for access token instead of cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    })
    res.status(201).send(user)
  } catch (err) {
    //unique fields
    if (err.name === 'MongoServerError' && err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]
      const msg = { [field]: `${field} must be unique.` }
      res.status(400).send(msg)
    }
    //mongoose validation
    else if (err.name === 'ValidationError') {
      const msg = {}
      for (const [key, value] of Object.entries(err.errors)) {
        msg[key] = value.message
      }
      res.status(400).send(msg)
    }
    //something else went wrong
    else {
      logger.error(err)
      res.status(500).send(err)
    }
  }
})

module.exports = router
