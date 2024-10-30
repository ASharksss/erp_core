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

  async createProduct(req, res) {
    try {
      const {vendor_code, name, description, categoryProductId} = req.body
      const product = await Product.create({vendor_code, name, description, categoryProductId})
      return res.json(product)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createProductCategory(req, res) {
    try {
      const {name} = req.body
      const category = await Category_product.create({name})
      return res.json(category)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createProductComponent(req, res) {
    try {
      const {vendor_code, componentId, count} = req.body
      const item = await Batch.create({vendor_code, count})
      return res.json(item)
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