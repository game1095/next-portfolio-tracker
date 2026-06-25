import express from 'express';
import Transaction from '../models/Transaction.js';
import YahooFinance from 'yahoo-finance2';
import cache from '../utils/cache.js';

const router = express.Router();
const yahooFinance = new YahooFinance();

// Helper to calculate Pearson correlation
function pearsonCorrelation(arr1, arr2) {
  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
  const n = Math.min(arr1.length, arr2.length);
  if (n === 0) return 0;
  
  for (let i = 0; i < n; i++) {
    sum1 += arr1[i];
    sum2 += arr2[i];
    sum1Sq += arr1[i] ** 2;
    sum2Sq += arr2[i] ** 2;
    pSum += arr1[i] * arr2[i];
  }
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - (sum1 ** 2) / n) * (sum2Sq - (sum2 ** 2) / n));
  if (den === 0) return 0;
  return num / den;
}

// Deep Analytics Endpoint
router.get('/deep', async (req, res) => {
  try {
    const filter = {};
    if (req.query.portfolioId && req.query.portfolioId !== 'global') {
      filter.portfolioId = req.query.portfolioId;
    }
    const transactions = await Transaction.find(filter).sort({ tradeDate: 1 });
    
    if (transactions.length === 0) {
      return res.json({ historicalTimeline: [], maxDrawdown: 0, forecast: [], correlationMatrix: {}, dcaEfficiency: {} });
    }

    const startDate = new Date(transactions[0].tradeDate);
    const today = new Date();
    
    // Find unique symbols
    const symbols = [...new Set(transactions.map(t => t.symbol))];
    
    // 1. Fetch historical data for all symbols from startDate to today
    const historicalData = {};
    const priceCache = {}; // Cache daily prices: priceCache[symbol]['YYYY-MM-DD'] = price

    const startStr = startDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    await Promise.all(symbols.map(async (sym) => {
      try {
        const cacheKey = `hist_${sym}_${startStr}_${todayStr}`;
        let hist = cache.get(cacheKey);
        
        if (!hist) {
          hist = await yahooFinance.historical(sym, { period1: startDate, period2: today, interval: '1d' });
          cache.set(cacheKey, hist, 3600); // Cache historical data for 1 hour
        }
        
        priceCache[sym] = {};
        hist.forEach(h => {
          const dateStr = h.date.toISOString().split('T')[0];
          priceCache[sym][dateStr] = h.close;
        });
        historicalData[sym] = hist;
      } catch (e) {
        console.error(`Failed to fetch history for ${sym}`);
      }
    }));

    // Generate timeline (trading days based on a major stock's history, e.g., the one with the most data)
    let bestSymbol = symbols[0];
    let maxDays = 0;
    symbols.forEach(sym => {
      if (historicalData[sym] && historicalData[sym].length > maxDays) {
        maxDays = historicalData[sym].length;
        bestSymbol = sym;
      }
    });

    if (!historicalData[bestSymbol]) {
       return res.status(500).json({ error: "Could not fetch market data" });
    }

    const tradingDays = historicalData[bestSymbol].map(h => h.date.toISOString().split('T')[0]);

    // Reconstruct Portfolio day-by-day
    const historicalTimeline = [];
    const holdingsMap = {}; // { AAPL: { shares: 0, cost: 0 } }
    
    let txIndex = 0;
    let maxDrawdown = 0;
    let peakValue = 0;

    tradingDays.forEach(dateStr => {
      const currentDate = new Date(dateStr);
      
      // Process transactions up to this date
      while (txIndex < transactions.length && new Date(transactions[txIndex].tradeDate) <= currentDate) {
        const tx = transactions[txIndex];
        if (!holdingsMap[tx.symbol]) {
          holdingsMap[tx.symbol] = { shares: 0, cost: 0 };
        }
        
        if (tx.type === 'SELL') {
          const avgCost = holdingsMap[tx.symbol].shares > 0 ? holdingsMap[tx.symbol].cost / holdingsMap[tx.symbol].shares : 0;
          holdingsMap[tx.symbol].shares -= tx.shares;
          holdingsMap[tx.symbol].cost -= avgCost * tx.shares;
        } else { // BUY
          holdingsMap[tx.symbol].shares += tx.shares;
          holdingsMap[tx.symbol].cost += tx.shares * tx.buyPrice;
        }
        txIndex++;
      }

      // Calculate portfolio value on this day
      let dailyMarketValue = 0;
      let dailyCostBasis = 0;

      Object.keys(holdingsMap).forEach(sym => {
        const shares = holdingsMap[sym].shares;
        if (shares > 0) {
          const price = priceCache[sym][dateStr] || historicalData[sym]?.[historicalData[sym].length - 1]?.close || 0;
          dailyMarketValue += shares * price;
          dailyCostBasis += holdingsMap[sym].cost;
        }
      });

      if (dailyCostBasis > 0) {
        historicalTimeline.push({
          date: dateStr,
          costBasis: dailyCostBasis,
          marketValue: dailyMarketValue
        });

        // Calculate Drawdown
        if (dailyMarketValue > peakValue) {
          peakValue = dailyMarketValue;
        }
        const drawdown = (dailyMarketValue - peakValue) / peakValue;
        if (drawdown < maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    });

    // 2. Logarithmic Forecasting
    // Fit y = a * ln(x) + b
    const forecast = [];
    if (historicalTimeline.length > 30) {
      let sumLnX = 0, sumY = 0, sumLnXY = 0, sumLnX2 = 0;
      const n = historicalTimeline.length;
      
      historicalTimeline.forEach((point, i) => {
        const x = i + 1;
        const y = point.marketValue;
        const lnX = Math.log(x);
        sumLnX += lnX;
        sumY += y;
        sumLnXY += lnX * y;
        sumLnX2 += lnX * lnX;
      });

      const b = (n * sumLnXY - sumLnX * sumY) / (n * sumLnX2 - sumLnX * sumLnX);
      const a = (sumY - b * sumLnX) / n;

      // Project 1 year into the future (approx 252 trading days)
      const lastDate = new Date(tradingDays[tradingDays.length - 1]);
      for (let i = 1; i <= 252; i += 21) { // 1 data point per month approx
        const projDate = new Date(lastDate);
        projDate.setDate(projDate.getDate() + (i * 1.4)); // convert trading days to calendar days approx
        const x = n + i;
        const projectedValue = b * Math.log(x) + a;
        
        forecast.push({
          date: projDate.toISOString().split('T')[0],
          projectedValue: Math.max(0, projectedValue) // Prevent negative values
        });
      }
    }

    // 3. Correlation Matrix (Top 5 holdings by current value)
    const currentValues = {};
    Object.keys(holdingsMap).forEach(sym => {
       const shares = holdingsMap[sym].shares;
       const lastPrice = historicalData[sym]?.[historicalData[sym].length - 1]?.close || 0;
       currentValues[sym] = shares * lastPrice;
    });

    const topSymbols = Object.keys(currentValues)
      .sort((a, b) => currentValues[b] - currentValues[a])
      .slice(0, 5);

    const correlationMatrix = {};
    // Calculate daily returns for top symbols
    const dailyReturns = {};
    topSymbols.forEach(sym => {
      const hist = historicalData[sym];
      dailyReturns[sym] = [];
      if (hist && hist.length > 1) {
        for (let i = 1; i < hist.length; i++) {
          const ret = (hist[i].close - hist[i-1].close) / hist[i-1].close;
          dailyReturns[sym].push(ret);
        }
      }
    });

    topSymbols.forEach(sym1 => {
      correlationMatrix[sym1] = {};
      topSymbols.forEach(sym2 => {
        if (sym1 === sym2) {
          correlationMatrix[sym1][sym2] = 1.0;
        } else {
          // Align arrays (in case of different lengths)
          const len = Math.min(dailyReturns[sym1].length, dailyReturns[sym2].length);
          const arr1 = dailyReturns[sym1].slice(-len);
          const arr2 = dailyReturns[sym2].slice(-len);
          correlationMatrix[sym1][sym2] = pearsonCorrelation(arr1, arr2);
        }
      });
    });

    res.json({
      historicalTimeline,
      maxDrawdown,
      forecast,
      correlationMatrix,
      topSymbols
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error calculating deep analytics' });
  }
});

export default router;
