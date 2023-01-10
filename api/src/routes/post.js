const express = require('express')
const {
  createPost,
  getPosts,
  deletePost,
  editPost,
} = require('../controllers/postController')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/', getPosts)
router.post('/', isAuthenticated, createPost)
router.put('/:id', isAuthenticated, editPost)
router.delete('/:id', isAuthenticated, deletePost)

module.exports = router
