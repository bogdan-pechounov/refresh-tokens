const express = require('express')
const {
  createPost,
  getPosts,
  deletePost,
} = require('../controllers/postController')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/', getPosts)
router.post('/', isAuthenticated, createPost)
router.delete('/:id', isAuthenticated, deletePost)

module.exports = router
