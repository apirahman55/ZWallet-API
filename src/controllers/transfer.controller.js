const status = require('../helpers/statusCode.helper')
const { findUsers, getUserById, updateUserBalance } = require('../models/users.model')
const { insertTransactions, getTransaction, getTransactionsByUserid, getTransactions, deleteTransaction, updateTransactionData } = require('../models/transactions.model')

class Transfer {
  async findUsersData(req, res) {
    const { name } = req.query
    if (!name)
      return res.status(status.BADREQUEST).json({
        status: false,
        message: "query name must be filled",
        data: []
      })

    try {
      const data = await findUsers(name)

      if (data.length) {
        res.status(status.OK).json({
          status: true,
          message: "Success find users data",
          data
        })
      } else {
        res.status(status.OK).json({
          status: false,
          message: "User data isn't available",
          data
        })
      }
    } catch (error) {
      console.log(error)

      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed find users data",
        data: []
      })
    }
  }

  async transferBalance(req, res) {
    let { id_from, id_to, total } = req.body
    total = parseInt(total)

    if (id_from == id_to)
      return res.status(status.BADREQUEST).json({
        status: false,
        message: "You cannot Transfer Balance to yourself"
      })

    try {
      const checkFrom = await getUserById(id_from)
      if (!checkFrom.length)
        return res.status(status.BADREQUEST).json({
          status: false,
          message: "ID User from isn't available"
        })

      const checkTo = await getUserById(id_to)
      if (!checkTo.length)
        return res.status(status.BADREQUEST).json({
          status: false,
          message: "ID User To isn't available"
        })

      const currentBalanceFrom = checkFrom[0].balance
      const currentBalanceTo = checkTo[0].balance
      if (currentBalanceFrom < total)
        return res.status(status.UNAUTHORIZED).json({
          status: false,
          message: "Balance is not enough"
        })

      await updateUserBalance({ id: id_from, balance: currentBalanceFrom - total })
      await updateUserBalance({ id: id_to, balance: currentBalanceTo + total })

      await insertTransactions(req.body)

      res.status(status.CREATED).json({
        status: true,
        message: "Transfer has successfully"
      })
    } catch (error) {
      console.log(error)

      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed Transfer Balance"
      })
    }
  }

  async getAllHistory(req, res) {
    try {
      const data = await getTransactions()
      if (!data.length)
        return res.status(status.OK).json({
          status: true,
          message: "Don't have any transaction",
          data: []
        })

      res.status(status.OK).json({
        status: true,
        message: "Success get data Transaction",
        data
      })
    } catch (error) {
      console.log(error)

      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get history transaction data",
        data: []
      })
    }
  }

  async getHistoryByUserId(req, res) {
    const { id } = req.params

    try {
      const checkUser = await getUserById(id)
      if (!checkUser.length)
        return res.status(status.BADREQUEST).json({
          status: false,
          message: "ID User isn't available",
          data: []
        })

      const data = await getTransactionsByUserid(id)
      if (!data.length)
        return res.status(status.OK).json({
          status: true,
          message: "You don't have any transaction",
          data: []
        })

      res.status(status.OK).json({
        status: true,
        message: "Success get Transaction data",
        data
      })
    } catch (error) {
      console.log(error)

      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get history transaction data",
        data: []
      })
    }
  }

  async updateTransactionData(req, res) {
    const { note } = req.body
    const { id } = req.params

    if (!id)
      return res.status(status.BADREQUEST).json({
        status: false,
        message: "Parameter id is not filled",
      })
    if (note) {
      try {
        const checkTransaction = await getTransaction(id)
        if (!checkTransaction.length)
          return res.status(status.BADREQUEST).json({
            status: false,
            message: "transaction id is not available"
          })

        await updateTransactionData(req.body, id)

        res.status(status.OK).json({
          status: true,
          message: `Success update transaction data`,
        })
      } catch (error) {
        res.status(status.INTERNALSERVERERROR).json({
          status: false,
          message: `Failed update transaction data`,
        })
      }
    } else {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "There are field not filled",
      })
    }
  }

  async deleteTransactionData(req, res) {
    const { id } = req.params
    try {
      const checkTransaction = await getTransaction(id)

      if (checkTransaction.length) {
        await deleteTransaction(id)

        res.status(status.OK).json({
          status: true,
          message: "Success delete transaction data",
        })
      } else {
        res.status(status.BADREQUEST).json({
          status: false,
          message: "transaction id is not available",
        })
      }

    } catch (error) {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "Failed delete transaction data",
      })
    }
  }
}

module.exports = new Transfer()