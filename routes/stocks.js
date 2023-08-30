require('dotenv').config();
const router = require("express").Router();
const axios = require('axios');

const apiKey = process.env.API_KEY
const newsApiKey = process.env.NEWS_API_KEY
const chartApiKey = process.env.CHART_API_KEY
const alphaKey = process.env.APLPHA_KEY

const apiUrl = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=TSLA,AAPL,NVDA,QQQ,AMD,VOO,AMC,TD,RBLX,INTC,KO,AI,LOGI,DIS,VYM,PG,SBUX,HD,COST,WMT,PFE&apiKey=";
const trendingStocksApi = "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey="

router.get("/stocks", (_req, res) => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${trendingStocksApi}${alphaKey}`)
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
            const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.CHART_API_KEY}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    
    fetchTickerData();
})

router.get("/all-stocks", (req, res) => {
    const fetchAllStocks = async () => {
        try {
            const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${apiKey}`)
            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchAllStocks();
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

    // Get today's date
    const today2 = new Date();

    // Set the time to yesterday at 9:30 am
    const yesterday930am = new Date(today2.getFullYear(), today2.getMonth(), today2.getDate() - 1, 9, 30, 0);
    const yesterday930amTimestamp = Math.floor(yesterday930am.getTime() / 1000);

    // Set the time to yesterday at 4:00 pm
    const yesterday4pm = new Date(today2.getFullYear(), today2.getMonth(), today2.getDate() - 1, 16, 0, 0);
    const yesterday4pmTimestamp = Math.floor(yesterday4pm.getTime() / 1000);

    currentTime.setMinutes(currentTime.getMinutes() - 20);
    currentTime.getHours() > 16 ? (currentTime.setHours(16), currentTime.setMinutes(00)) : "";
    const todayDay = Date.parse(today) / 1000;
    const currentTimeTime = Date.parse(currentTime) / 1000;

    const { ticker } = req.params;
    const fetchTimestampData = async () => {
        try {
            // respolution values to be used: 5, 15
            const response = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=15&from=${todayDay}&to=${currentTimeTime}&token=${chartApiKey}`)
            if (response.data.s == "no_data") {
                const response2 = await axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=15&from=${yesterday930amTimestamp}&to=${yesterday4pmTimestamp}&token=${chartApiKey}`)
                res.status(200).json(response2.data)    
            }
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
            // const response = await axios.get(`https://api.polygon.io/v2/reference/news?order=desc&limit=10&apiKey=${apiKey}`)
            const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${newsApiKey}`)

            res.status(200).json(response.data)
        } catch (err) {
            res.status(400).send(err);
        }
    }
    fetchNewsData();
})


module.exports = router;