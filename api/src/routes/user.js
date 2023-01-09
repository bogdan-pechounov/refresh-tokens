const express = require('express')

const router = express.Router()

//Create images directory
const fs = require('fs')
const dir = './images'

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

//File Storage
const multer = require('multer')
const {
  editUser,
  deleteUser,
  getUser,
} = require('../controllers/userController')
const isAuthenticated = require('../middlewares/isAuthenticated')
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
router.get('/', isAuthenticated, getUser)

router.put('/', upload.single('image'), isAuthenticated, editUser)

router.delete('/', isAuthenticated, deleteUser)

module.exports = router
