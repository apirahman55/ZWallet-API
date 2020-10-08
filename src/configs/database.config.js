const mysql = require('mysql')

module.exports = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: "12345678",
    database: process.env.DB_DATABASE,
})
