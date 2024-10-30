class ProductController {
  async getProducts(req, res) {
    try {
      return res.json('ляляля')
    } catch (e) {
      return res.json({error: e.message})
    }
  }
}

module.exports = new ProductController()