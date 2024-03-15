const express = require('express')

//Contorller function
const {signupUser, loginUser} = require('../controllers/userController.js')

const router = express.Router()

//Login route
router.post('/login', loginUser)

//Signup Route
router.post('/signup', signupUser)

module.exports = router