const status = require('../helpers/statusCode.helper')
const { getTopup, getAllTopup, deleteTopup, updateTopup, insertTopup } = require('../models/topup.model')

class Topup {
  async getAllTopup(req, res) {
    try {
      const data = await getAllTopup()

      res.status(status.OK).json({
        status: true,
        message: "Success get all topup",
        data
      })
    } catch (error) {
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get all topup",
        data: []
      })
    }
  }

  async getTopup(req, res) {
    const { id } = req.params
    try {
      const data = await getTopup(id)
      if (data.length) {
        res.status(status.OK).json({
          status: true,
          message: "Success get topup data",
          data: data[0]
        })
      } else {
        res.status(status.BADREQUEST).json({
          status: false,
          message: "topup id is not available",
          data: {}
        })
      }
    } catch (error) {
      res.status(status.INTERNALSERVERERROR).json({
        status: false,
        message: "Failed get topup data",
        data: {}
      })
    }
  }

  async insertTopup(req, res) {
    if (req.body.detail) {
      try {
        await insertTopup(req.body)

        res.status(status.CREATED).json({
          status: true,
          message: `Success add topup data`,
        })
      } catch (error) {
        res.status(status.INTERNALSERVERERROR).json({
          status: false,
          message: `Failed add topup data`,
        })
      }
    } else {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "There are field not filled",
      })
    }
  }

  async updateTopup(req, res) {
    if (req.body.detail) {
      try {
        const checkTopup = await getTopup(req.params.id)
        if (!checkTopup.length)
          return res.status(status.BADREQUEST).json({
            status: false,
            message: `topup id is not available`,
          })
        await updateTopup(req.body, req.params.id)

        res.status(status.OK).json({
          status: true,
          message: `Success update topup data`,
        })
      } catch (error) {
        res.status(status.INTERNALSERVERERROR).json({
          status: false,
          message: `Failed update topup data`,
        })
      }
    } else {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "There are field not filled",
      })
    }
  }

  async deleteTopup(req, res) {
    const { id } = req.params
    try {
      const checkTopup = await getTopup(id)

      if (checkTopup.length) {
        await deleteTopup(id)

        res.status(status.OK).json({
          status: true,
          message: "Success delete topup data",
        })
      } else {
        res.status(status.BADREQUEST).json({
          status: false,
          message: "topup id is not available",
        })
      }

    } catch (error) {
      res.status(status.BADREQUEST).json({
        status: false,
        message: "Failed delete topup data",
      })
    }
  }
}

module.exports = new Topup()