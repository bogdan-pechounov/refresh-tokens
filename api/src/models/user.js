const mongoose = require('mongoose')
const { isEmail } = require('validator')
const password = require('../utils/password')
const { hashPassword } = require('../utils/password')

//todo profile picture
//todo oauth
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Username required'],
    minLength: [4, 'Username should have at least 4 characters'],
  },
  email: {
    type: String,
    unique: true,
    sparse: true, //ignore documents without the email field when determining uniqueness
    validate: [isEmail, 'Please enter a valid email'],
  },
  profile_picture: String,
  password: String,
  confirmPassword: String,
  hashedPassword: String,
  refreshTokens: {
    type: [String],
    default: [],
  },
  resetPassword: {
    token: String,
    expiration: Date,
  },
  provider: String,
})

//validate passwords (use a required field)
UserSchema.path('name').validate(function (v) {
  const { password, confirmPassword, provider } = this
  if (provider && !password) return //no need for password if using oauth

  if (password || confirmPassword) {
    if (password?.length < 6) {
      this.invalidate('password', 'Password should have at least 6 characters')
    }
    if (password !== confirmPassword) {
      this.invalidate('confirmPassword', 'Passwords do not match')
    }
  }

  if ((this.isNew && !password) || password === '') {
    this.invalidate('password', 'Password required')
  }
}, null)

UserSchema.post('validate', async function (doc) {
  //hash password
  if (this.password) this.hashedPassword = await hashPassword(this.password)

  //remove plain password before saving
  doc.password = undefined
  doc.confirmPassword = undefined
})

//remove fields before sending response
UserSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.hashedPassword
  delete obj.refreshTokens
  delete obj.resetPassword
  return obj
}

const User = mongoose.model('User', UserSchema)
module.exports = User
