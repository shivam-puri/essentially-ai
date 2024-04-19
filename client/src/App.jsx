import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import StockTable from './components/StockTable'

function App() {

  const [data, setData] = useState([])
  const [numberOfStocks, setNumberOfStocks] = useState(10)
  const [loading, setLoading] = useState(true)

  const getStockList = async () => {
    try {

      const response = await axios.get('http://localhost:5000/stocks', { params: { numberOfStocks } })

      if (response) {
        setInterval(async () => {
          const data = await axios.get('http://localhost:5000/file')
          setData(data.data)
          setLoading(false)
        }, 1000)
      }
    } catch (error) {

      setLoading(false)
      console.log(error)
    }
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setData([])
    setLoading(true)
    getStockList();
  }


  useEffect(() => {
    getStockList()
  }, [])

  return (
    <>
      <div className='parent-container' >
        <form className='input-container'
          onSubmit={handleSubmitForm}
        >
          <div className='wrapper' >
            <input
              value={numberOfStocks}
              onChange={(e) => setNumberOfStocks(e.target.value)}
              autoFocus
              type="number"
              max={20}
              min={1}
              disabled={loading}
            />
            <button type='submit' >get stocks</button>
          </div>
        </form>
        <div className='table-container' >
          <StockTable loading={loading} numberOfStocks={numberOfStocks} stockData={data} />
        </div>
      </div>
    </>
  )
}

export default App