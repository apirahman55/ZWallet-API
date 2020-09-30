const express = require('express')
const router = express.Router()

const { getAllTopup, getTopup, updateTopup, deleteTopup, insertTopup } = require('../controllers/topup.controller')

router
  .get('/', getAllTopup)
  .get('/:id', getTopup)
  .post('/', insertTopup)
  .patch('/:id', updateTopup)
  .delete('/:id', deleteTopup)
module.exports = router