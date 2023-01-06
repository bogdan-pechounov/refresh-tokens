const passport = require('passport')
const User = require('../models/user')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GithubStrategy = require('passport-github2').Strategy
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = require('./config')

passport.use(
  new GoogleStrategy(
    {
      //options
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      //callback
      const {
        id,
        _json: { name, email, picture },
      } = profile
      try {
        //get user
        const user = await User.findOne({ email })
        if (user) {
          done(null, user)
        } else {
          //create new user
          const newUser = await new User({
            name,
            email,
            profile_picture: picture,
            provider: 'google',
          }).save()
          done(null, newUser)
        }
      } catch (err) {
        done(err)
      }
    }
  )
)

passport.use(
  new GithubStrategy(
    {
      //options
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      //callback
      const {
        _json: { id, name, avatar_url, email },
      } = profile
      try {
        //get user
        const user = await User.findOne({ email })
        if (user) {
          done(null, user)
        } else {
          //create new user
          const newUser = await new User({
            name,
            email,
            profile_picture: avatar_url,
            provider: 'github',
          }).save()
          done(null, newUser)
        }
      } catch (err) {
        done(err)
      }
    }
  )
)
