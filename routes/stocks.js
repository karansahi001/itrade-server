require('dotenv').config();
const router = require("express").Router();
const axios = require('axios');
const apiKey = process.env.API_KEY

const apiUrl = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=TSLA,AAPL,NVDA,QQQ,AMD,VOO,AMC,TD&apiKey=";

router.get("/stocks", (_req, res) => {
    const fetchData = async () => {
        try{
            const response = await axios.get(`${apiUrl}${apiKey}`)
            res.status(200).json(response.data)
        }catch(err){
            res.status(400).send(err);
        }
    }
    fetchData();
})

module.exports = router;