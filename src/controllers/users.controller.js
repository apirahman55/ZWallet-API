const status = require('../helpers/statusCode.helper')
const { getUsers, getUserById, getUsersPaginate, insertUser, updateUser, deleteUser } = require('../models/users.model')

class Users {
    async getAllUsers(req, res) {
        try {
            const data = await getUsers()

            res.status(status.OK).json({
                status: true,
                message: "Success get all users",
                data
            })
        } catch (error) {
            res.status(status.INTERNALSERVERERROR).json({
                status: false,
                message: "Failed get all users",
                data: []
            })
        }
    }

    async getUserById(req, res) {
        const { id } = req.params
        try {
            const data = await getUserById(id)
            if (data.length) {
                res.status(status.OK).json({
                    status: true,
                    message: "Success get user data",
                    data: data[0]
                })
            } else {
                res.status(status.BADREQUEST).json({
                    status: false,
                    message: "user id is not available",
                    data: {}
                })
            }
        } catch (error) {
            res.status(status.INTERNALSERVERERROR).json({
                status: false,
                message: "Failed get user data",
                data: {}
            })
        }
    }

    async getUsersPaginate(req, res) {
        const { offset, limit } = req.query

        try {
            const data = await getUsersPaginate(limit, offset)
            res.status(status.OK).json({
                status: true,
                message: `Success get users pagination`,
                data
            })
        } catch (error) {
            res.status(status.INTERNALSERVERERROR).json({
                status: false,
                message: "Failed get users pagination data",
                data: []
            })
        }
    }

    async insertUser(req, res) {
        if (req.body.name && req.body.phone && req.body.email && req.body.password && req.body.balance && req.body.verified && req.body.photo && req.body.pin) {
            try {
                await insertUser(req.body)

                res.status(status.CREATED).json({
                    status: true,
                    message: `Success add user data`,
                })
            } catch (error) {
                res.status(status.INTERNALSERVERERROR).json({
                    status: false,
                    message: `Failed add user data`,
                })
            }
        } else {
            res.status(status.BADREQUEST).json({
                status: false,
                message: "There are field not filled",
            })
        }
    }

    async updateUser(req, res) {
        const { name, phone, photo } = req.body
        const { id } = req.params

        if (!id)
            return res.status(status.BADREQUEST).json({
                status: false,
                message: "Parameter id is not filled",
            })
        if (name && phone && photo) {
            try {
                const checkUser = await getUserById(id)
                if (!checkUser.length)
                    return res.status(status.BADREQUEST).json({
                        status: false,
                        message: "user id is not available"
                    })

                await updateUser(req.body, id)

                res.status(status.OK).json({
                    status: true,
                    message: `Success update user data`,
                })
            } catch (error) {
                res.status(status.INTERNALSERVERERROR).json({
                    status: false,
                    message: `Failed update user data`,
                })
            }
        } else {
            res.status(status.BADREQUEST).json({
                status: false,
                message: "There are field not filled",
            })
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params
        try {
            const checkUser = await getUserById(id)

            if (checkUser.length) {
                await deleteUser(id)

                res.status(status.OK).json({
                    status: true,
                    message: "Success delete user data",
                })
            } else {
                res.status(status.BADREQUEST).json({
                    status: false,
                    message: "user id is not available",
                })
            }

        } catch (error) {
            res.status(status.BADREQUEST).json({
                status: false,
                message: "Failed delete user data",
            })
        }
    }
}

module.exports = new Users()