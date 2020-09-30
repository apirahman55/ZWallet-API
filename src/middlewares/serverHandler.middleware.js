const status = require('../helpers/statusCode.helper')

exports.statusNotFound = (req, res) => {
    res.json({
        status: false,
        message: "404 Not Found"
    }).status(status.NOTFOUND)
}