import React from 'react';
import "../styling/table.css"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const StockTable = ({ stockData, numberOfStocks, loading }) => {

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    return (
        <SkeletonTheme baseColor='#332e38' highlightColor='#26222a' >
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Open</th>
                        <th>Low</th>
                        <th>High</th>
                        <th>Ticker</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.length > 0 && !loading && (
                        stockData.map((stock) => (
                            <tr key={stock.ticker} className="stock-row">
                                <td className="stock-cell">{stock.name || <Skeleton />}</td>
                                <td className="stock-cell">{roundToTwo(stock.close)}</td>
                                <td className="stock-cell">{roundToTwo(stock.open)}</td>
                                <td className="stock-cell">{stock.low}</td>
                                <td className="stock-cell">{stock.high}</td>
                                <td className="stock-cell">{stock.ticker}</td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>
            {
                loading && (
                    <div className='loading-parent'>
                        {Array.from({ length: numberOfStocks }).map((_, index) => (
                            <Skeleton style={{ width: '100%', marginBottom: '10px', height: '50px' }} />
                        ))}
                    </div>
                )
            }


        </SkeletonTheme>
    );
};

export default StockTable;
