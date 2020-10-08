const express = require('express')
const router = express.Router()
const { body } = require('express-validator');

const { getAllUsers, getUsersPaginate, insertUser, updateUser, deleteUser, transferBalance, getUserById, findUsersData, createPin, getUserByToken, getHistoryByUserId, getHistoryById, addPhoneNumber, deletePhoneNumber, changePassword } = require('../controllers/users.controller')

const validatePin = [
  body("pin").isLength({ min: 6, max: 6 }).withMessage("PIN must be 6 character")
]

const validateTransfer = [
  body("id").not().isEmpty().withMessage("ID Cannot be empty"),
  body("total").not().isEmpty().withMessage("Total Cannot be empty"),
  body("note").not().isEmpty().withMessage("Note Cannot be empty")
]

const validateAddPhone = [
  body("phone").not().isEmpty().withMessage("Phone Cannot be empty"),
]

const validatePassword = [
  body("password").not().isEmpty().withMessage("Password cannot be null"),
  body("passwordNew").not().isEmpty().withMessage("Password New cannot be null")
]
router
  .patch("/create_pin", validatePin, createPin)
  .get('/detail', getUserByToken)
  .patch('/password', validatePassword, changePassword)
  .get('/history', getHistoryByUserId)
  .get('/history/:id', getHistoryById)
  .get('/histories', getHistoryByUserId)
  .get("/search", findUsersData)
  .post("/transfer", transferBalance)
  .patch("/phone", validateAddPhone, addPhoneNumber)
  .delete("/phone", deletePhoneNumber)
  .get('/', getAllUsers)
  .get('/paginate', getUsersPaginate)
  .get('/:id', getUserById)
  .post('/', insertUser)
  .patch('/:id', updateUser)
  .delete('/:id', deleteUser)
module.exports = router