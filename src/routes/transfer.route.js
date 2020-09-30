const express = require('express')
const router = express.Router()

const { findUsersData, transferBalance, getHistoryByUserId, getAllHistory, updateTransactionData, deleteTransactionData } = require('../controllers/transfer.controller')

router
  .get('/', findUsersData)
  .post('/', transferBalance)
  .get('/history/:id', getHistoryByUserId)
  .get('/history', getAllHistory)
  .patch('/history/:id', updateTransactionData)
  .delete('/history/:id', deleteTransactionData)
module.exports = router
