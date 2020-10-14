const { compareSync, genSaltSync, hashSync } = require('bcryptjs')
const { validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken')
const { insertUser, getUserByEmail, getUserById } = require("../models/users.model")
const status = require('../helpers/statusCode.helper')

class Auth {
  async loginUser(req, res) {
    try {

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(status.BADREQUEST).json({
          success: false,
          message: errors.array()[0].msg,
          data: {}
        })

      let checkEmail = await getUserByEmail(req.body.email)
      if (!checkEmail.length)
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          message: "Email and Password incorrect",
          data: {}
        })
      checkEmail = checkEmail[0]
      const compare = compareSync(req.body.password, checkEmail.password)
      if (!compare)
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          message: "Email and Password incorrect",
          data: {}
        })

      return res.status(status.CREATED).json({
        success: true,
        message: "Login Succesfully",
        data: {
          token: sign({ id: checkEmail.id }, process.env.SECRET),
        }
      })
    } catch (e) {
      return res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "Internal server error",
        data: {}
      })
    }
  }

  async registerUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(status.BADREQUEST).json({
          success: false,
          message: errors.array()[0].msg,
          data: {}
        })

      let checkEmail = await getUserByEmail(req.body.email)
      if (checkEmail.length)
        return res.status(status.UNAUTHORIZED).json({
          success: false,
          message: "Email has been taken",
          data: {}
        })

      const data = await insertUser({
        name: req.body.name,
        email: req.body.email,
        password: hashSync(req.body.password, genSaltSync(10))
      })

      return res.status(status.CREATED).json({
        success: true,
        message: "Register Succesfully",
        data: {
          token: sign({ id: data.insertId }, process.env.SECRET),
        }
      })
    } catch (e) {
      return res.status(status.INTERNALSERVERERROR).json({
        success: false,
        message: "Internal server error",
        data: {}
      })
    }
  }

}

module.exports = new Auth()