const express = require('express')
const { createPost, getPosts } = require('../controllers/postController')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/', getPosts)
router.post('/', isAuthenticated, createPost)

module.exports = router
