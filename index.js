require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const stocksRouter = require("./routes/stocks.js")
const port = process.env.PORT || 8000;

app.use(cors());

app.use('/', stocksRouter);

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})