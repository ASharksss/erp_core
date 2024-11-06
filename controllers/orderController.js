const path = require("path");
const reader = require('xlsx')
const fs = require('fs')
const xlsx = require("xlsx");
const {Order, Order_list} = require("../models/models");

class OrderController {
  async checkOrderExcel(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json("Файл не загружен")
      }
      const file = req.files.file

      //Путь до папки временного сохранения
      const filePath = path.join(__dirname, '..', 'static/excel', file.name)

      //Определяем путь временного хранения файла
      await file.mv(filePath)

      //Чтение файла
      const workbook = xlsx.readFile(filePath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: 1})

      let articleColumnIndex = jsonData[0].indexOf("Артикул");
      let quantityColumnIndex = jsonData[0].indexOf("Количество");

      // Если столбцы не найдены
      if (articleColumnIndex === -1) {
        fs.unlinkSync(filePath);
        return res.status(400).json({message: 'Столбец "Артикул" не найден.'});
      }
      if (quantityColumnIndex === -1) {
        fs.unlinkSync(filePath);
        return res.status(400).json({message: 'Столбец "Количество" не найден.'});
      }
      const result = []
      for (let i = 1; i < jsonData.length; i++) {
        const article = jsonData[i][articleColumnIndex]
        const quantity = jsonData[i][quantityColumnIndex]
        if (article && quantity) {
          result.push({article, quantity})
        }
      }

      fs.unlinkSync(filePath)

      return res.json(result)
    } catch (e) {
      return res.json({message: e.message})
    }
  }

  //Добавить транзакции
  async createOrder(req, res) {
    try {
      const {arr, customer} = req.body
      let order = await Order.create({customer})
      for (let item of arr) {
        await Order_list.create({
          productVendorCode: item.article,
          count: item.quantity,
          orderId: order.id
        })
      }
      return res.json(order)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

}

module.exports = new OrderController()