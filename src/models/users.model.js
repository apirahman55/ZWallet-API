const db = require('../configs/database.config')
const query = require('../helpers/query.helper')


class UserModel {
    getUsers() {
        return query("SELECT id, name, phone, email, balance, photo FROM users")
    }

    findUsers(name, limit = 5, offset = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 5

        return query("SELECT id, name, phone, photo, balance FROM users WHERE name LIKE ? ORDER BY name asc LIMIT ? OFFSET ?", [name + "%", limitNew, (offsetNew - 1) * limitNew])
    }

    getUserByEmail(email) {
        return query("SELECT * FROM users WHERE email = ?", [email])
    }

    getUsersPaginate(limit = 5, offset = 1) {
        const limitNew = !isNaN(parseInt(limit)) ? parseInt(limit) : 5
        const offsetNew = !isNaN(parseInt(offset)) ? parseInt(offset) : 5

        return query("SELECT id, name, phone, photo, balance FROM users LIMIT ? OFFSET ?", [limitNew, (offsetNew - 1) * limitNew])
    }

    getUserById(id) {
        return query("SELECT id, name, email, password, phone, photo, pin, balance FROM users WHERE id = ?", [id])
    }

    deleteUser(id) {
        return query("DELETE FROM users WHERE id = ?", [id])
    }

    insertUser(data) {
        return query("INSERT INTO users SET ?", data)
    }

    updateUserBalance(data) {
        const { balance, id } = data
        return query("UPDATE users SET balance = ? WHERE id = ?", [balance, id])
    }

    updateUser(data, id) {
        return query("UPDATE users SET ? WHERE id = ?", [data, id])
    }
}

module.exports = new UserModel()