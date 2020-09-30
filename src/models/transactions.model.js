const db = require('../configs/database.config')

class Transactions {
    getTransactions() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT a.id, a.note, a.total, b.name AS _from, c.name AS _to FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    getTransaction(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id FROM transactions WHERE id='${id}'`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }


    getTransactionsByUserid(user_id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT a.id, a.note, a.total, b.name AS _from, c.name AS _to FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id WHERE a.id_from_user = ${user_id} OR a.id_to_user= ${user_id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    insertTransactions(data) {
        const { id_from, id_to, note, total } = data
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO transactions (id_from_user, id_to_user, note, total) VALUES (${id_from}, ${id_to}, '${note}', '${total}')`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    updateTransactionData(data, id) {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE transactions SET note='${data.note}' WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    } e

    deleteTransaction(id) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM transactions WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                console.log(result)
                resolve(result)
            })
        })
    }
}

module.exports = new Transactions()