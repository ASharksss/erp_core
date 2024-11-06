const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/checkOrderExcel', orderController.checkOrderExcel)
router.post('/createOrder', orderController.createOrder)


module.exports = router