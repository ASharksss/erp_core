const path = require("path");
const reader = require('xlsx')
const fs = require('fs')
const xlsx = require("xlsx");

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

      return res.json({
        message: `Данные успешно прочитаны`,
        data: result
      })
    } catch (e) {
      return res.json({message: e.message})
    }
  }
}

module.exports = new OrderController()