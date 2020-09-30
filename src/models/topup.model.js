const db = require('../configs/database.config')

class TopUp {
    getAllTopup() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM topup`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    getTopup(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM topup WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    deleteTopup(id) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM topup WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    insertTopup(data) {
        const { detail } = data

        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO topup (detail) VALUES ('${detail}')`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    updateTopup(data, id) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE topup SET detail='${data.detail}' WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }
}

module.exports = new TopUp()