const mongoose = require('mongoose')
const { isEmail } = require('validator')
const { hashPassword } = require('../utils/password')

//todo profile picture
//todo oauth
const userSchema = mongoose.Schema({
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
    validate: [isEmail, 'Please enter a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minLength: [6, 'Password should have at least 6 characters'],
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: [matches, 'The passwords do not match'],
  },
  hashedPassword: {
    type: String,
  },
})

userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.hashedPassword
  return obj
}

function matches() {
  const { password, confirmPassword } = this
  return password === confirmPassword
}

userSchema.post('validate', async function (doc) {
  //hash password
  this.hashedPassword = await hashPassword(this.password)

  //remove plain password before saving
  doc.password = undefined
  doc.confirmPassword = undefined
})

const User = mongoose.model('User', userSchema)
module.exports = User
