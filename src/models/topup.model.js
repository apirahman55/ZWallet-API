const query = require('../helpers/query.helper')

class TopUp {
    getAllTopup() {
        return query("SELECT * FROM topup")
    }

    getTopup(id) {
        return query("SELECT * FROM topup WHERE id = ?", [id])
    }

    deleteTopup(id) {
        return query("DELETE FROM topup WHERE id = ?", [id])
    }

    insertTopup(data) {
        return query("INSERT INTO topup SET ?", [data])
    }

    updateTopup(data, id) {
        return query("UPDATE topup SET ? WHERE id = ?", [data, id])
    }
}

module.exports = new TopUp()