const Post = require('../models/post')
const User = require('../models/user')
const { clearCookie } = require('../utils/tokens')

exports.getUser = async (req, res) => {
  const { userId } = req
  const user = await User.findById(userId)
  res.send(user)
}

exports.editUser = async (req, res) => {
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
}

exports.deleteUser = async (req, res) => {
  const { userId: _id } = req
  await User.deleteOne({ _id })
  await Post.deleteMany({ user: _id })
  clearCookie(res)
  res.send('Account deleted')
}
