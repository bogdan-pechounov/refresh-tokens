const express = require('express')
const { me, logout, login, signup } = require('../controllers/authController')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/me', isAuthenticated, me)

// router.get('/me', isAuthenticated, async (req, res) => {
//   res.send(await User.findById(req.userId))
// })

router.get('/logout', logout)

router.post('/signup', signup)

router.post('/login', login)

module.exports = router
