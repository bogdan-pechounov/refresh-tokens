const { cookie_options } = require('../utils/tokens')

const tokens = require('csrf')()

async function csrf(req, res, next) {
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    //set cookie secret and header token
    const secret = await tokens.secret()
    const token = tokens.create(secret)
    res.cookie('csrf-secret', secret, cookie_options)
    res.set('X-CSRF-Token', token)
    next()
  } else {
    //verify secret in cookie and token in header
    const secret = req.cookies['csrf-secret']
    const token = req.headers['x-csrf-token']
    if (tokens.verify(secret, token)) {
      next()
    } else {
      res.status(403).send('Can not verify csrf token')
    }
  }
}

module.exports = csrf
