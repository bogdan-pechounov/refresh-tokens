const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('./config')

passport.use(
  new GoogleStrategy(
    {
      //options
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
    },
    () => {
      //callback
    }
  )
)
