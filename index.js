require('dotenv').config()
const express = require('express')

const app = express()

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Сервер стартовал на порту ${PORT}`)
})