const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require('../config/config')
const jwt = require('jsonwebtoken')

const access_token_expires_in = '15m'
const refresh_token_expires_in = '7d'
const cookie_options = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

module.exports = {
  createAccessToken(id) {
    return jwt.sign(
      {
        id,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: access_token_expires_in }
    )
  },
  createRefreshToken(id) {
    return jwt.sign(
      {
        id,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: refresh_token_expires_in }
    )
  },
  setAccessToken(res, accessToken) {
    res.set('X-Access-Token', accessToken)
    res.set('Cache-Control', 'no-store') //prevent caching the token
  },
  getAccessToken(req) {
    return req.headers['x-access-token']
  },
  setRefreshToken(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, cookie_options)
  },
  getRefreshToken(req) {
    return req.cookies.refreshToken
  },
  clearCookie(res) {
    const { maxAge, ...options } = cookie_options
    res.clearCookie('refreshToken', options)
  },
  cookie_options,
}
