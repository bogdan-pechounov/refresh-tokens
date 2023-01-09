const User = require('../models/user')

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

//todo delete posts
exports.deleteUser = async (req, res) => {
  const { userId: id } = req
  await User.deleteOne({ id })
  res.send('Account deleted')
}
