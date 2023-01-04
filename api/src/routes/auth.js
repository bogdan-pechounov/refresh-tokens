const express = require('express')
const {
  me,
  logout,
  login,
  signup,
  resetPassword,
  requestNewPassword,
} = require('../controllers/authController')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/me', isAuthenticated, me)

router.get('/logout', logout)

router.post('/signup', signup)

router.post('/login', login)

router.post('/request-new-password', requestNewPassword)

router.post('/reset-password/', resetPassword)

module.exports = router
