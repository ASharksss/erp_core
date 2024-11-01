const {Product, Category_product, Batch, Product_components, Components, Batch_components} = require("../models/models");

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: {
          model: Category_product,
          attributes: ['name']
        },
      })
      return res.json(products)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createBatch(req, res) {
    try {
      const {productVendorCode, count} = req.body
      const batch = await Batch.create({productVendorCode, count})
      const expenses = await Product_components.findAll({
        where: {productVendorCode},
        attributes: ['componentId', 'count'],
        include: [{model: Components, attributes: ['name']}]
      })
      expenses.map(async item => {
        let batch_expenses = await Batch_components.create({
          com
        })


      })
      return res.json(expenses)
    } catch (e) {
      return res.json({error: e.message})
    }
  }


}

module.exports = new ProductController()