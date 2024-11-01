const {Product, Category_product, Batch} = require("../models/models");

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
      const {vendor_code, count} = req.body
      const batch = await Batch.create({vendor_code, count})

      return res.json(batch)
    } catch (e) {
      return res.json({error: e.message})
    }
  }


}

module.exports = new ProductController()