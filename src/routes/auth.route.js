const express = require('express')
const router = express.Router()
const { body } = require('express-validator');
const { loginUser, registerUser } = require('../controllers/auth.controller')

const loginValidation = [
  body('email').isEmail().withMessage("Email format is incorrect!"),
  body('password').isLength({ min: 6 }).withMessage("Password must be min 6"),
]
const registerValidation = [
  body('name').not().isEmpty().withMessage("Name must be filled"),
  ...loginValidation,
]

router
  .post('/register', registerValidation, registerUser)
  .post('/login', loginValidation, loginUser)
module.exports = router