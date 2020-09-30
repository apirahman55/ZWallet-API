const db = require('../configs/database.config')

class UserModel {
    getUsers() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, name, phone, email, balance, photo FROM users`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    findUsers(name) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, name, phone, photo, balance FROM users WHERE name LIKE '${name}%' ORDER BY name asc`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    getUsersPaginate(limit = 5, offset = 1) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, name, phone, photo, balance FROM users LIMIT ${limit} OFFSET ${(parseInt(offset) - 1) * parseInt(limit)}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    getUserById(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, name, phone, photo, balance FROM users WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    deleteUser(id) {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                console.log(result)
                resolve(result)
            })
        })
    }

    insertUser(data) {
        const { name, phone, email, password, balance, verified, photo, pin } = data

        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (name, phone, email, password, balance, verified, photo, pin) VALUES ('${name}', '${phone}', '${email}', '${password}', ${balance}, ${verified}, '${photo}', '${pin}')`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    updateUserBalance(data) {
        const { balance, id } = data
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET balance='${balance}' WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }

    updateUser(data, id) {
        const { name, photo, phone } = data
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET name='${name}', photo='${photo}', phone='${phone}' WHERE id=${id}`, (error, result) => {
                if (error) reject(error)
                resolve(result)
            })
        })
    }
}

module.exports = new UserModel()