const {
  Product,
  Category_product,
  Batch,
  Product_components,
  Components, Transaction,
  Batch_components, Supply, Stock_components
} = require("../models/models");


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


  //Добавить функцию вычитания со склада материалов
  async createBatch(req, res) {
    try {
      const {productVendorCode, count} = req.body
      //Создаем партию
      const batch = await Batch.create({productVendorCode, count})

      //Находим растраты на 1 товар
      const expenses = await Product_components.findAll({
        where: {productVendorCode},
        attributes: ['componentId', 'count']
      })
      //Перебираем
      expenses.map(async item => {
        //записываем растраты на партию
        await Batch_components.create({
          batchId: batch.id,
          componentId: item.componentId,
          count: item.count * count
        })
        //находим компоненты на складе
        const component = await Stock_components.findOne({
          where: {componentId: item.componentId}
        })

        if (component) {
          // Вычитаем компоненты
          component.count -= item.count * count
          await component.save()
          //Записываем транзакцию
          await Transaction.create({
            type: "Расход",
            componentId: item.componentId,
            count: item.count * count,
            direction: "Расход на товар"
          })
        } else {
          return res.json({message: "Не найдены расходные материалы на складе"})
        }

      })
      return res.json(expenses)
    } catch (e) {
      return res.json({error: e.message})
    }
  }

  async createSupplyArray(req, res) {
    try {
      const array = req.body
      for (let item of array) {
        const component = await Stock_components.findOne({
          where: {componentId: item.componentId}
        })
        if (component) {
          component.count += item.count
          await component.save()
        } else {
          await Stock_components.create({
            componentId: item.componentId,
            count: item.count
          })
        }
        await Supply.create({
          componentId: item.componentId,
          count: item.count,
          data: item.date
        })

      }
      return res.json("Запасы успешно обновлены")
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }


}

module.exports = new ProductController()