import React, { useEffect, useState } from 'react';
import { IgrFinancialChart, IgrFinancialChartModule } from 'igniteui-react-charts';
import { Loader } from './Loader';
import { fetchData } from './api';

IgrFinancialChartModule.register();

function App() {
  const [candleData, setCandleData] = useState([]);
  const [interval, setInterval] = useState('1M');

  useEffect(() => {
    fetchData(interval, setCandleData);
  }, [interval]);
  
  const handleRefreshClick = () => {
    fetchData(interval, setCandleData);
  };

  const handleIntervalChange = e => {
    setInterval(e.target.value);
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