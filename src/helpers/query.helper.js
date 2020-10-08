const db = require('../configs/database.config')

const QUERY = (query, payload = null) => {
  return new Promise((resolve, reject) => {
    db.query(query, payload, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = QUERY