const express = require('express')

const port = process.env.PORT || 3000;

var app = express()

app.use(express.static('./dist/public'))

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/public/index.html')
})

app.listen(port)