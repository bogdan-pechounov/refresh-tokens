const Post = require('../models/post')

exports.getPosts = async (req, res) => {
  const posts = await Post.find().sort({ updatedAt: -1 }).populate('user')
  const numPosts = await Post.count()
  res.send({ posts, count: numPosts })
}

exports.createPost = async (req, res) => {
  const { userId: user } = req
  const { title, body } = req.body
  const post = await new Post({ title, body, user }).save()
  res.status(201).send(post)
}

exports.editPost = async (req, res) => {
  const { userId } = req
  const postId = req.params.id
  const { title, body } = req.body

  const post = await Post.findOne({ _id: postId })

  if (post.user.toString() !== userId) {
    res.sendStatus(403)
  } else {
    post.title = title
    post.body = body
    const newPost = await post.save()
    res.send(newPost)
  }
}

exports.deletePost = async (req, res) => {
  const { userId } = req
  const postId = req.params.id
  await Post.deleteOne({ _id: postId, user: userId })
  res.send('Post deleted')
}
