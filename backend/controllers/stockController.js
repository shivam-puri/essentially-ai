const fs = require('fs')

// Function to fetch details for a single stock
const fetchStockDetails = async (ticker) => {
    try {
        const response = await fetch(`https://api.polygon.io/v1/open-close/${ticker}/2023-01-09?adjusted=true&apiKey=${process.env.API_KEY}`);
        const stockDetails = await response.json();

        // Assigning random values to stocks because the free tier version of polygon
        // does not supports required number of requests per min
        if (stockDetails.status === 'ERROR' || stockDetails.status === 'NOT_FOUND') {
            console.log("error encoutered, dummy data")
            const obj = {
                open: Math.random() * (30) + 70,
                close: Math.random() * (30) + 70,
                low: 65,
                high: 100
            }
            return obj
        }
        return stockDetails;

    } catch (error) {
        console.error(`Failed to fetch details for ${ticker}:`, error);
        // Return default values or handle error as needed
        return {};
    }
};

// Function to fetch list of stocks
const getStocksController = async (req, res) => {
    try {
        const { numberOfStocks } = req.query
        console.log("numberOfStocks", numberOfStocks)

        if (!numberOfStocks) {
            return res.status(400).json({ error: 'Number of stocks is required.' });
        } else if (numberOfStocks > 20 || numberOfStocks < 1) {
            return res.status(400).json({ error: 'Number of stocks should be selected between 1 to 20' });

        }

        // Fetching list of stocks
        const stocksResponse = await fetch(`https://api.polygon.io/v3/reference/tickers?active=true&limit=${numberOfStocks}&apiKey=${process.env.API_KEY}`);
        const stocksData = await stocksResponse.json();

        // Array to store pending promises that are going to fetch stock details 
        const stockDetailPromises = []

        // Checking if the fetched data has the expected structure
        if (!stocksData.results || !Array.isArray(stocksData.results)) {
            return res.status(500).json({ error: 'Unexpected response from the API' });
        }

        // looping through all the fetched stocks and storing promises to fetch stock details in the array
        // [ Fetch details for each stock in parallel ]
        for (const stock of stocksData.results) {
            const detailsPromise = fetchStockDetails(stock.ticker)
            stockDetailPromises.push(detailsPromise)
        }

        // waiting for all promises to resolve
        // stockDetails is a promise returned by the promise.all function after resolving all promises
        const stockDetails = await Promise.all(stockDetailPromises)



        // combining stock with details
        const stockWithDetails = stocksData.results.map((stock, index) => ({
            name: stock.name,
            ticker: stock.ticker,
            open: stockDetails[index].open,
            close: stockDetails[index].close,
            low: stockDetails[index].low,
            high: stockDetails[index].high,
            refreshInterval: Math.random() * 4 + 1
        }))

        fs.writeFile('stockData.json', JSON.stringify(stockWithDetails), err => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("file written successfully")
            }
        })


        res.json({
            success: true,
            stockWithDetails
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
};


module.exports = { getStocksController };