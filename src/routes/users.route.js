const express = require('express')
const router = express.Router()

const { getAllUsers, getUsersPaginate, insertUser, updateUser, deleteUser, getUserById } = require('../controllers/users.controller')

router
  .get('/', getAllUsers)
  .get('/paginate', getUsersPaginate)
  .get('/:id', getUserById)
  .post('/', insertUser)
  .patch('/:id', updateUser)
  .delete('/:id', deleteUser)
module.exports = router