const express = require('express')
const passport = require('passport')
const {
  me,
  logout,
  login,
  signup,
  resetPassword,
  requestNewPassword,
  oauthCallback,
} = require('../controllers/authController')
const isAuthenticated = require('../middlewares/isAuthenticated')
require('../config/passport-setup')

const router = express.Router()

router.get('/me', isAuthenticated, me)

router.get('/logout', logout)

router.post('/signup', signup)

router.post('/login', login)

router.post('/request-new-password', requestNewPassword)

router.post('/reset-password/', resetPassword)

//oauth
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
)
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  oauthCallback
)

router.get(
  '/github',
  passport.authenticate('github', {
    session: false,
    scope: ['user:email'],
  })
)
router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
  }),
  oauthCallback
)
module.exports = router
