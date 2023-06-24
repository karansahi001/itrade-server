require('dotenv').config();
const router = require("express").Router();
const axios = require('axios');
const stocksController = require("../controllers/stocksData")

const apiKey = process.env.API_KEY
const newsApiKey = process.env.NEWS_API_KEY
const chartApiKey = process.env.CHART_API_KEY

const apiUrl = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=TSLA,AAPL,NVDA,QQQ,AMD,VOO,AMC,TD,RBLX,INTC,KO,AI,LOGI,DIS,VYM,PG,SBUX,HD,COST,WMT,PFE&apiKey=";

router.get("/stocks", (_req, res) => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchData();
})

router.get("/stocks/:ticker", (req, res) => {
    const { ticker } = req.params
    const fetchTickerData = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchTickerData();
})

router.get("/stock-data/:ticker", (req, res) => {
    const { ticker } = req.params
    const fetchTickerData = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${ticker}&apiKey=${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchTickerData();
})

router.get("/additional-data/:ticker", (req, res) => {
    const { ticker } = req.params
    const fetchAdditionalData = async () => {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${newsApiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchAdditionalData();
})

router.get("/stocks-chartdata/:ticker/", (req, res) => {
    // Get today's date
    const today = new Date();
    const currentTime = new Date();
    // Set the time to 9:30 am
    today.setHours(9);
    today.setMinutes(30);
    today.setSeconds(0);
    today.setMilliseconds(0);

    currentTime.setMinutes(currentTime.getMinutes() - 20);
    currentTime.getHours() > 16 ? (currentTime.setHours(16),currentTime.setMinutes(00) ) : "";
    const todayDay = Date.parse(today) / 1000;
    const currentTimeTime = Date.parse(currentTime) / 1000;

    const { ticker } = req.params;
    const fetchTimestampData = async () => {
        try {
            const response = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=15&from=${todayDay}&to=${currentTimeTime}&token=${chartApiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchTimestampData();
})

router.get("/news/:ticker", (req, res) => {
    const { ticker } = req.params
    const fetchNewsData = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&order=desc&limit=6&sort=published_utc&apiKey=${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchNewsData();
})

router.get("/losers", (_req, res) => {

    const fetchLosersData = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchLosersData();
})

router.get("/gainers", (_req, res) => {

    const fetchGainersData = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchGainersData();
})

router.get("/news", (_req, res) => {

    const fetchNewsData = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/reference/news?order=desc&limit=10&apiKey=${apiKey}`)
            res.status(200).json(response.data.results)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchNewsData();
})

router.post("/stocks", stocksController.buy)

module.exports = router;