const jwt = require('jsonwebtoken')
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require('../config')
const User = require('../models/user')
const logger = require('../utils/logger')
const {
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  createAccessToken,
  setRefreshToken,
  createRefreshToken,
} = require('../utils/tokens')

module.exports = async (req, res, next) => {
  const accessToken = getAccessToken(req)
  const refreshToken = getRefreshToken(req)

  console.log('TEST', accessToken)
  console.log('TEST2', refreshToken)

  async function resetTokens() {
    //todo detect refresh token reuse
    try {
      const { id } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
      console.log(jwt.verify(refreshToken, REFRESH_TOKEN_SECRET))
      const user = await User.findById(id)
      setAccessToken(res, createAccessToken(id))
      setRefreshToken(res, createRefreshToken(id))
      req.userId = id
      next()
    } catch (err) {
      logger.error(err)
      res.status(401).send('Invalid credentials')
    }
  }

  //access token alone is enough to authenticate you
  if (accessToken) {
    try {
      const { id } = jwt.verify(accessToken, ACCESS_TOKEN_SECRET)
      req.userId = id
      next()
    } catch (err) {
      //if expired, check refreshToken
      if (err.name === 'TokenExpiredError' && refreshToken) {
        await resetTokens(res, refreshToken)
      } else {
        logger.error(err)
        res.status(401).send('Invalid credentials')
      }
    }
  }
  //if no access token, use the refresh token to create a new access token
  else if (refreshToken) {
    resetTokens(res, refreshToken)
  } else {
    res.status(401).send('Not logged in')
  }
}
