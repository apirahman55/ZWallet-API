const status = require('../helpers/statusCode.helper')
const { getUsers, getUserById, getUsersPaginate, insertUser, updateUserBalance, updateUser, deleteUser, findUsers } = require('../models/users.model')
const { validationResult } = require('express-validator');
const { verify } = require('jsonwebtoken')
const { getAllTransactionsByUserid, getTransactionsByUserid, getTransactionsByid, insertTransactions } = require('../models/transactions.model')
const { compareSync, hashSync, genSaltSync } = require('bcryptjs')
const multer = require('multer');
const upload = require("../helpers/multer.helper")


class Users {
  async getAllUsers(req, res) {
    try {
      const data = await getUsers()

      res.status(status.OK).json({
        status: true,
        message: "Success get all users",
        data
      })
    } catch (error) {
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get all users",
        data: []
      })
    }
  }

  async getUserById(req, res) {
    const { id } = req.params
    try {
      const data = await getUserById(id)
      delete data[0].balance
      delete data[0].pin
      delete data[0].password
      if (data.length) {
        res.status(status.OK).json({
          status: true,
          message: "Success get user data",
          data: data[0]
        })
      } else {
        res.status(status.BADREQUEST).json({
          status: false,
          message: "user id is not available",
          data: {}
        })
      }
    } catch (error) {
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get user data",
        data: {}
      })
    }
  }

  async getUsersPaginate(req, res) {
    const { offset, limit } = req.query

    try {
      const data = await getUsersPaginate(limit, offset)
      res.status(status.OK).json({
        status: true,
        message: `Success get users pagination`,
        data
      })
    } catch (error) {
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get users pagination data",
        data: []
      })
    }
  }

  async insertUser(req, res) {
    if (req.body.name && req.body.phone && req.body.email && req.body.password && req.body.balance && req.body.verified && req.body.photo && req.body.pin) {
      try {
        await insertUser(req.body)

        res.status(status.CREATED).json({
          status: true,
          message: `Success add user data`,
        })
      } catch (error) {
        res.status(status.INTERNALSERVERERROR).json({
          status: false,
          message: `Failed add user data`,
        })
      }
    } else {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "There are field not filled",
      })
    }
  }

  async updateUser(req, res) {
    const { name, phone, photo } = req.body
    const { id } = req.params

    if (!id)
      return res.status(status.BADREQUEST).json({
        status: false,
        message: "Parameter id is not filled",
      })
    if (name && phone && photo) {
      try {
        const checkUser = await getUserById(id)
        if (!checkUser.length)
          return res.status(status.BADREQUEST).json({
            status: false,
            message: "user id is not available"
          })

        await updateUser(req.body, id)

        res.status(status.OK).json({
          status: true,
          message: `Success update user data`,
        })
      } catch (error) {
        res.status(status.INTERNALSERVERERROR).json({
          status: false,
          message: `Failed update user data`,
        })
      }
    } else {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "There are field not filled",
      })
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params
    try {
      const checkUser = await getUserById(id)

      if (checkUser.length) {
        await deleteUser(id)

        res.status(status.OK).json({
          status: true,
          message: "Success delete user data",
        })
      } else {
        res.status(status.BADREQUEST).json({
          status: false,
          message: "user id is not available",
        })
      }

    } catch (error) {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "Failed delete user data",
      })
    }
  }

  async findUsersData(req, res) {
    const { q, limit, offset } = req.query
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)

    try {
      const data = await findUsers(q, limit, offset)

      const filter = data.filter(item => item.id !== decoded.id)
      if (filter.length) {
        res.status(status.OK).json({
          status: true,
          message: "Success find users data",
          data: filter
        })
      } else {
        res.status(status.OK).json({
          status: false,
          message: "User data isn't available",
          data: []
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

  async createPin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(status.BADREQUEST).json({
          success: false,
          message: errors.array()[0].msg,
        })

      const bearerToken = req.headers['authorization'].split(' ')[1]
      const decoded = verify(bearerToken, process.env.SECRET)

      await updateUser({ pin: req.body.pin }, decoded.id)

      return res.status(status.CREATED).json({
        success: true,
        message: "Success create pin"
      })
    } catch (e) {
      res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "Internal Server Error"
      })
    }
  }

  async getUserByToken(req, res) {
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)
    try {

      const data = await getUserById(decoded.id)
      delete data[0].pin
      delete data[0].password
      return res.status(status.OK).json({
        success: true,
        message: "Success get user",
        data: data[0]
      })
    } catch (e) {
      return res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "Internal Server Error",
        data: {}
      })
    }
  }

  async getHistoryByUserId(req, res) {
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)

    try {
      const data = await getTransactionsByUserid(decoded.id)
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
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Internal server error",
        data: []
      })
    }
  }

  async getAllHistoryByUserId(req, res) {
    const { limit, offset } = req.query
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)

    try {
      const data = await getAllTransactionsByUserid(decoded.id, limit, offset)
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
        message: "Internal server error",
        data: []
      })
    }
  }

  async transferBalance(req, res) {
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)
    let { id, note, total, pin } = req.body
    total = parseInt(total)

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(status.BADREQUEST).json({
          success: false,
          message: errors.array()[0].msg,
        })

      const checkFrom = await getUserById(decoded.id)
      if (checkFrom[0].pin !== pin)
        return res.status(status.UNAUTHORIZED).json({
          status: false,
          message: "Wrong pin"
        })

      const checkTo = await getUserById(id)
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

      await updateUserBalance({ id: decoded.id, balance: currentBalanceFrom - total })
      await updateUserBalance({ id: id, balance: currentBalanceTo + total })

      const data = await insertTransactions({
        id_from_user: decoded.id,
        id_to_user: id,
        note,
        total
      })

      res.status(status.CREATED).json({
        status: true,
        message: "Transfer has successfully",
        data: {
          id: data.insertId
        }
      })
    } catch (error) {
      console.log(error)
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed Transfer Balance"
      })
    }
  }

  async getHistoryById(req, res) {
    const { id } = req.params
    try {
      const data = await getTransactionsByid(id)

      res.status(status.OK).json({
        status: true,
        message: "Success get Transaction data",
        data: data[0]
      })
    } catch (error) {
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Internal server error",
        data: []
      })
    }
  }

  async addPhoneNumber(req, res) {
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(status.BADREQUEST).json({
          success: false,
          message: errors.array()[0].msg,
        })

      await updateUser({ phone: req.body.phone }, decoded.id)
      return res.status(status.CREATED).json({
        success: true,
        message: "Number has been added",
      })
    } catch (error) {
      return res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "INTERNAL SERVER ERROR",
      })
    }
  }

  async deletePhoneNumber(req, res) {
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)
    try {
      await updateUser({ phone: null }, decoded.id)
      return res.status(status.OK).json({
        success: true,
        message: "Number has been deleted",
      })
    } catch (error) {
      return res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "INTERNAL SERVER ERROR",
      })
    }
  }

  async changePassword(req, res) {
    const bearerToken = req.headers['authorization'].split(' ')[1]
    const decoded = verify(bearerToken, process.env.SECRET)
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(status.BADREQUEST).json({
          success: false,
          message: errors.array()[0].msg,
        })

      const data = await getUserById(decoded.id)
      if (!compareSync(req.body.password, data[0].password))
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          message: "Your password entered is wrong",
        })

      await updateUser({ password: hashSync(req.body.passwordNew, genSaltSync(10)) }, decoded.id)
      return res.status(status.OK).json({
        success: true,
        message: "The number has been added",
      })
    } catch (e) {
      console.log(e)
      return res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "INTERNAL SERVER ERROR",
      })
    }
  }

  async uploadImage(req, res) {
    const uploadImage = upload(4).single("photo")
    uploadImage(req, res, async (err) => {
      if (err)
        res.status(status.BADREQUEST).json({
          success: false,
          message: err.message,
          data: {}
        })

      const file = req.file
      if (!file)
        res.status(status.BADREQUEST).json({
          success: false,
          message: "Field Photo must be filled",
          data: {}
        })

      const bearerToken = req.headers['authorization'].split(' ')[1]
      const decoded = verify(bearerToken, process.env.SECRET)
      try {
        const photo = `${process.env.BASE_URL}/public/images/${req.file.filename}`
        await updateUser({ photo }, decoded.id)

        res.status(status.CREATED).json({
          success: true,
          message: "Success uploading photo",
          data: { photo },
        })
      } catch (error) {
        res.status(status.INTERNALSERVERERROR).json({
          success: false,
          message: "INTERNAL SERVER ERROR",
          data: {}
        })
      }
    })
  }
}

module.exports = new Users()