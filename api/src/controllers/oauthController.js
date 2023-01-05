const passport = require('passport')
require('../config/passport-setup')

exports.google = passport.authenticate('google', {
  scope: ['profile'],
})

exports.googleRedirect = (req, res) => {
  res.send('worked')
}
