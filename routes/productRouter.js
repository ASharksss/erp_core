const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

router.get('/getProducts', productController.getProducts)
router.post('/createProduct', productController.createProduct)
router.post('/createProductCategory', productController.createProductCategory)


module.exports = router