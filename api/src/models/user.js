const mongoose = require('mongoose')
const { isEmail } = require('validator')
const { hashPassword } = require('../controllers/authController')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Username required'],
      minLength: [4, 'Username should have at least 4 characters'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      validate: [isEmail, 'Please enter a valid email.'],
    },
    hashedPassword: {
      type: String,
      select: false,
      required: [true, 'Password required'],
    },
  },
  {
    virtuals: {
      password: {
        get() {
          return this._password
        },
        async set(v) {
          this._password = v
        },
      },
      confirmPassword: {
        get() {
          return this._confirmPassword
        },
        set(v) {
          this._confirmPassword = v
        },
      },
    },
  }
)

//check passwords
userSchema.pre('validate', async function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'please enter the same password')
  }

  if (this.password?.length >= 6) {
    this.hashedPassword = await hashPassword(this.password)
  } else {
    this.invalidate('password', 'Password should have at least 6 characters')
  }
  next()
})

//hash password before saving
// userSchema.pre('save', async function (next) {
//   if (this.isModified('hashedPassword')) {
//     try {
//       this.hashedPassword = await hashPassword(this.password)
//     } catch (err) {
//       return next(err)
//     }
//   }
//   next()
// })

const User = mongoose.model('User', userSchema)
module.exports = User
