import React, { useEffect, useState } from 'react';
import { IgrFinancialChart, IgrFinancialChartModule } from 'igniteui-react-charts';
import { Loader } from './Loader';

IgrFinancialChartModule.register();

function App() {
  const [candleData, setCandleData] = useState([]);
  const [interval, setInterval] = useState('1M');
  const [indexSplit, setIndexSplit] = useState([]);
  const [indexDiv, setIndexDiv] = useState([]);

  const intervalLimits = {
    '1m': 24 * 60,
    '5m': 24 * 60 * 7,
    '15m': 24 * 60 * 30,
    '30m': 24 * 60 * 30,
    '1h': 24 * 60 * 30,
    '1d': 24 * 60 * 30,
    '1w': 24 * 60 * 30,
    '1M': 24 * 60 * 30
  };

  const fetchData = async () => {
    const burl = 'https://api.binance.com';
    const query = `/api/v1/klines?symbol=BTCUSDT&interval=${interval}&limit=${intervalLimits[interval]}`;
    const url = burl + query;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const processedData = processData(jsonData);
        setCandleData(processedData);
      } else {
        console.error('Empty or invalid data received');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
};

  const processData = candles => {
    let minClose = 0;
    let maxClose = 0;
    let minIndex = 0;
    let maxIndex = 0;
    let indexSplit = [];
    let indexDiv = [];

    const processedData = candles.map((candle, index) => {
        const candleData = {
            Date: new Date(candle[0]),
            Open: parseFloat(candle[1]),
            High: parseFloat(candle[2]),
            Low: parseFloat(candle[3]),
            Close: parseFloat(candle[4]),
            Volume: parseFloat(candle[5])
        };

        if (candleData.Close < minClose) {
            minClose = candleData.Close;
            minIndex = index;
        }
        if (candleData.Close > maxClose) {
            maxClose = candleData.Close;
            maxIndex = index;
        }

        if (indexSplit.length < 5 && Math.random() < 0.1) {
          const randomIndex = Math.floor(Math.random() * candles.length);
          indexSplit.push(randomIndex);
        }
      
        if (indexDiv.length < 5 && Math.random() < 0.1) {
          const randomIndex = Math.floor(Math.random() * candles.length);
          indexDiv.push(randomIndex);
        }

        return candleData;
    });

    indexSplit.forEach(idx => {
      processedData[idx].info = `Sell ↓ ${processedData[idx].Close}`;
  });
  indexDiv.forEach(idx => {
      processedData[idx].info = `Buy ↑ ${processedData[idx].Close}`;
  });

    processedData[minIndex].info = "MIN";
    processedData[maxIndex].info = "MAX";

    return processedData;
};
  useEffect(() => {
    fetchData();
    setIndexSplit([]);
    setIndexDiv([]);
  }, [interval]);

  const handleIntervalChange = e => {
    setInterval(e.target.value);
  };

  const handleRefreshClick = () => {
    fetchData();
  };

  return (
    <div className="container sample">
      <div className="container">
        <div>
          <label htmlFor="interval">Interval:</label>
          <select id="interval" value={interval} onChange={handleIntervalChange}>
            <option value="1m">1 min</option>
            <option value="5m">5 min</option>
            <option value="15m">15 min</option>
            <option value="30m">30 min</option>
            <option value="1h">1 h</option>
            <option value="1d">1 d</option>
            <option value="1w">1 w</option>
            <option value="1M">1 M</option>
          </select>
        </div>
        <button onClick={handleRefreshClick}>Refresh</button>
        {candleData.length > 0 ? (
          <IgrFinancialChart
            width="100%"
            height="600px"
            isToolbarVisible={false}
            chartType="Candle"
            chartTitle="BTCUSDT"
            titleAlignment="Left"
            titleLeftMargin="25"
            titleTopMargin="10"
            titleBottomMargin="10"
            subtitle={`${interval} interval`}
            subtitleAlignment="Left"
            subtitleLeftMargin="25"
            subtitleTopMargin="5"
            subtitleBottomMargin="10"
            yAxisLabelLocation="OutsideLeft"
            yAxisMode="Numeric"
            yAxisTitle="Financial Prices"
            yAxisTitleLeftMargin="10"
            yAxisTitleRightMargin="5"
            yAxisLabelLeftMargin="0"
            zoomSliderType="None"
            dataSource={candleData}
            calloutsVisible={true} 
            calloutsXMemberPath={candleData.Date}
            calloutsYMemberPath="Close"
            calloutsLabelMemberPath = "info"
            calloutsContentMemberPath="info"
            crosshairsSnapToData={false}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

export default App;