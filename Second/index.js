const express = require('express')
const app = express()
const port = 3000
const data = require('./MOCK_DATA.json')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/contacts',(req, res) => {
  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
