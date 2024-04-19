const express = require("express")
const { getStocksController } = require("../controllers/stockController.js")
const router = express.Router()

router.get('/', getStocksController)

module.exports = router