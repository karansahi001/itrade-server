require('dotenv').config();
const router = require("express").Router();
const axios = require('axios');
const stocksController = require("../controllers/stocksData")
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

router.get("/stocks/:ticker", (req, res) => {
    const { ticker } = req.params
    const fetchTickerData = async () => {
        try{
            const response = await axios.get(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        }catch(err){
            res.status(400).send(err);
        }
    }
    fetchTickerData();
})

router.get("/news/:ticker", (req, res) => {
    const { ticker } = req.params
    const fetchNewsData = async () => {
        try{
            const response = await axios.get(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&order=asc&limit=6&sort=published_utc&apiKey=${apiKey}`)
            res.status(200).json(response.data)
        }catch(err){
            res.status(400).send(err);
        }
    }
    fetchNewsData();
})

router.get("/losers", (_req, res) => {

    const fetchLosersData = async () => {
        try{
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        }catch(err){
            res.status(400).send(err);
        }
    }
    fetchLosersData();
})

router.get("/gainers", (_req, res) => {

    const fetchGainersData = async () => {
        try{
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        }catch(err){
            res.status(400).send(err);
        }
    }
    fetchGainersData();
})

router.post("/stocks", stocksController.buy)

module.exports = router;