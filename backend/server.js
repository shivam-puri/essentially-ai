const express = require('express')
const dotenv = require('dotenv')
const fs = require('fs');
const cors = require("cors")
const path = require("path")

// Importing route files
const stockRoutes = require("./routes/stocks")

// configuring dotenv
dotenv.config()
// backend PORT
const PORT = process.env.PORT || 5000
// creating instance of express app
const app = express();
app.use(cors())



// Middleware for parsing JSON bodies
app.use(express.json())


app.use('/stocks', stockRoutes)


const dataFile = path.join(__dirname, 'stockData.json');
let stockData; // Storing data in memory to avoid continous file changes resulting server restart

// Reading initial data from file on startup
try {
    stockData = fs.readFileSync(dataFile, 'utf8');
    stockData = JSON.parse(stockData);
} catch (error) {
    console.error('Error reading stock data from file:', error);
    stockData = []; // Handling errors
}


function updateClose(stock) {
    // Calculating new close value 
    const newClose = Math.random() * (stock.high - stock.low) + stock.low;
    stock.close = newClose.toFixed(2); // Round to 2 decimal places
}


function scheduleUpdates() {
    stockData.forEach(stock => {
        setInterval(() => {
            updateClose(stock);
        }, stock.refreshInterval * 1000); // Convert refreshInterval to milliseconds
    });
}

app.use('/file', (req, res) => {
    res.json(stockData)
})

scheduleUpdates()

app.listen(PORT, () => {
    console.log(`Server started @ PORT ${PORT}`)
})