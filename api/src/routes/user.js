const express = require('express')

const router = express.Router()

//Create directory
const fs = require('fs')
const dir = './images'

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

//File Storage
const multer = require('multer')
const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/user')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    const fileName = Date.now().toString() + '_' + file.originalname
    cb(null, fileName)
  },
})

const upload = multer({ storage })

//Routes
router.get('/', isAuthenticated, async (req, res) => {
  const { userId } = req
  const user = await User.findById(userId)
  res.send(user)
})

router.put('/', upload.single('image'), isAuthenticated, async (req, res) => {
  const { userId } = req
  const { name, email, password, confirmPassword } = req.body
  let user = await User.findById(userId)
  if (req.file) user.profile_picture = req.file.filename
  for (const [key, val] of Object.entries({
    name,
    email,
    password,
    confirmPassword,
  })) {
    user[key] = val
  }
  user = await user.save()
  res.send(user)
})

router.delete('/', isAuthenticated, async (req, res) => {
  const { userId: id } = req
  await User.deleteOne({ id })
  res.send('Account deleted')
})

module.exports = router
