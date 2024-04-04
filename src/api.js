const fetchData = async (interval, setCandleData) => {
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
  const processedData = candles.map((candle, index) => {
    const candleData = {
      Date: new Date(candle[0]),
      Open: parseFloat(candle[1]),
      High: parseFloat(candle[2]),
      Low: parseFloat(candle[3]),
      Close: parseFloat(candle[4]),
      Volume: parseFloat(candle[5]),
      sell: false
    };

    if (candleData.Close < minClose) {
      minClose = candleData.Close;
      minIndex = index;
    }
    if (candleData.Close > maxClose) {
      maxClose = candleData.Close;
      maxIndex = index;
    }

    return candleData;
  });

  const indexSplit = Array.from({ length: 5 }, () => Math.floor(Math.random() * candles.length));
  const indexDiv = Array.from({ length: 5 }, () => Math.floor(Math.random() * candles.length));
  indexSplit.forEach(idx => {
    processedData[idx].info = "Sell ↓ " + processedData[idx].Close;
    processedData[idx].sell = true;
  });
  indexDiv.forEach(idx => {
    processedData[idx].info = "Buy ↑ " + processedData[idx].Close;
    processedData[idx].sell = false;
  });

  processedData[minIndex].info = 'MIN';
  processedData[maxIndex].info = 'MAX';

  return processedData;
};


export { fetchData };