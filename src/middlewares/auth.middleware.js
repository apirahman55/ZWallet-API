const { verify } = require('jsonwebtoken')
const status = require('../helpers/statusCode.helper')

class Auth {
  verify(req, res, next) {
    let bearerToken = req.headers['authorization']
    if (typeof bearerToken === "undefined")
      return res.status(status.NOTFOUND).json({
        success: false,
        message: "Not Found"
      })

    bearerToken = bearerToken.split(' ')[1]

    if (!bearerToken)
      return res.status(status.BADREQUEST).json({
        success: false,
        message: "Bad Request"
      })

    return verify(bearerToken, process.env.SECRET, (err, data) => {
      if (err)
        console.log(err)
      // return res.status(status.BADREQUEST).json({
      //   success: false,
      //   message: "Bad Request"
      // })

      return next()
    })
  }
}

module.exports = new Auth()