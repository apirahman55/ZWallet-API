const db = require('../configs/database.config')
const query = require('../helpers/query.helper')

class Transactions {
    getTransactions() {
        return query("SELECT a.id, a.note, a.total, b.name AS _from, c.name AS _to FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id")
    }

    getTransaction(id) {
        return query("SELECT id FROM transactions WHERE id = ?", [id])
    }


    getAllTransactionsByUserid(id, limit = 5, offset = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 5

        return query("SELECT a.id, a.note, a.total, b.name AS from_name, c.name AS to_name, b.email AS from_email, c.email AS to_email, a.created_at FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id WHERE a.id_from_user = ? OR a.id_to_user = ? LIMIT ? OFFSET ?", [id, id, limitNew, (offsetNew - 1) * limitNew])
    }

    getTransactionsByUserid(id) {
        return query("SELECT a.id, a.note, a.total, b.name AS from_name, c.name AS to_name, b.email AS from_email, c.email AS to_email, a.created_at FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id WHERE a.id_from_user = ? OR a.id_to_user = ? LIMIT 5", [id, id])
    }

    getTransactionsByid(id) {
        return query("SELECT a.id, a.note, a.total, c.phone, c.photo, c.name, c.email, a.created_at FROM transactions AS a INNER JOIN users AS b ON a.id_from_user = b.id INNER JOIN users AS c ON a.id_to_user = c.id WHERE a.id = ?", [id])
    }

    insertTransactions(data) {
        return query("INSERT INTO transactions SET ?", data)
    }

    updateTransactionData(data, id) {
        return query("UPDATE transactions SET ?' WHERE id = ?", [data, id])
    }

    deleteTransaction(id) {
        return query("DELETE FROM transactions WHERE id = ?", [id])
    }
}

module.exports = new Transactions()