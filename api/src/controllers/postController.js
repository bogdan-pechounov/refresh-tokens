const Post = require('../models/post')

exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({ updatedAt: 1 }).populate('user')
  const numPosts = await Post.count()
  res.send({ posts, count: numPosts })
}

exports.createPost = async (req, res) => {
  const { userId: user } = req
  const { title, body } = req.body
  const post = await new Post({ title, body, user }).save()
  res.status(201).send(post)
}
