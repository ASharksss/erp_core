const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/checkOrderExcel', orderController.checkOrderExcel)


module.exports = router