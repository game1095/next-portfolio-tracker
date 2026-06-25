import express from 'express';
import Transaction from '../models/Transaction.js';
import YahooFinance from 'yahoo-finance2';
import cache from '../utils/cache.js';
const yahooFinance = new YahooFinance();

const router = express.Router();

// Helper to get historical close price for a date
async function getHistoricalClose(symbol, date) {
  const d = new Date(date);
  const start = new Date(d);
  start.setDate(start.getDate() - 5); // Go back 5 days to cover weekends/holidays
  const end = new Date(d);
  end.setDate(end.getDate() + 1); // Exclusive end date

  try {
    const history = await yahooFinance.historical(symbol, { period1: start, period2: end });
    if (history && history.length > 0) {
      return history[history.length - 1].close;
    }
  } catch (err) {
    console.error(`Failed to fetch historical ${symbol}:`, err.message);
  }
  return null;
}

// Get all transactions with live market data & analytics
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.portfolioId && req.query.portfolioId !== 'global') {
      filter.portfolioId = req.query.portfolioId;
    }
    const transactionsRaw = await Transaction.find(filter).sort({ tradeDate: 1, createdAt: 1 });
    // Make deep copy so we can mutate and add realizedPl
    const transactions = JSON.parse(JSON.stringify(transactionsRaw));
    
    // Group transactions by symbol
    const holdingsMap = {};
    let totalPortfolioCost = 0;
    let currentMonthInvested = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    transactions.forEach(t => {
      if (!holdingsMap[t.symbol]) {
        holdingsMap[t.symbol] = {
          symbol: t.symbol,
          totalShares: 0,
          totalCost: 0,
          totalCostInThb: 0,
          benchmarkCost: 0, // IVV equivalent cost
          transactions: [],
          totalRealizedPl: 0,
          winCount: 0,
          lossCount: 0
        };
      }
      
      const holding = holdingsMap[t.symbol];

      if (t.type === 'SELL') {
        const currentAvgCost = holding.totalShares > 0 ? holding.totalCost / holding.totalShares : 0;
        const currentAvgIvvCost = holding.totalShares > 0 ? holding.benchmarkCost / holding.totalShares : 0;
        const currentAvgThbCost = holding.totalShares > 0 ? holding.totalCostInThb / holding.totalShares : 0;
        
        const costReduction = currentAvgCost * t.shares;
        const ivvReduction = currentAvgIvvCost * t.shares;
        const thbReduction = currentAvgThbCost * t.shares;
        
        holding.totalShares -= t.shares;
        holding.totalCost -= costReduction;
        holding.benchmarkCost -= ivvReduction;
        holding.totalCostInThb -= thbReduction;
        totalPortfolioCost -= costReduction;
        
        const saleProceeds = t.shares * t.buyPrice; // buyPrice acts as sellPrice
        const tradeRealizedPl = saleProceeds - costReduction;
        holding.totalRealizedPl += tradeRealizedPl;
        t.realizedPl = tradeRealizedPl;
        
        if (tradeRealizedPl > 0) holding.winCount++;
        else holding.lossCount++;

      } else { // BUY
        holding.totalShares += t.shares;
        const cost = (t.shares * t.buyPrice);
        holding.totalCost += cost;
        totalPortfolioCost += cost;
        
        const fxRate = t.exchangeRateAtTrade || 35.0;
        holding.totalCostInThb += cost * fxRate;

        const tradeDateObj = new Date(t.tradeDate);
        if (tradeDateObj.getMonth() === currentMonth && tradeDateObj.getFullYear() === currentYear) {
            currentMonthInvested += cost;
        }
        
        if (t.benchmarkPriceAtTrade) {
          const ivvShares = cost / t.benchmarkPriceAtTrade;
          holding.benchmarkCost += ivvShares;
        }
      }
      
      holding.transactions.push(t);
    });

    // Reverse for UI history
    transactions.sort((a, b) => new Date(b.tradeDate) - new Date(a.tradeDate));

    const holdings = Object.values(holdingsMap).map(h => ({
      ...h,
      averageCost: h.totalShares > 0 ? h.totalCost / h.totalShares : 0
    }));

    // Fetch live market data (Quotes + FX + Benchmark)
    const symbols = holdings.map(h => h.symbol);
    const apiSymbols = [...symbols, 'USDTHB=X', 'IVV'];
    
    let marketData = {};
    let quoteSummaries = {};
    
    try {
      if (apiSymbols.length > 0) {
        const cacheKey = `quotes_${apiSymbols.sort().join('_')}`;
        let quotesArray = cache.get(cacheKey);
        
        if (!quotesArray) {
          const quotes = await yahooFinance.quote(apiSymbols);
          quotesArray = Array.isArray(quotes) ? quotes : [quotes];
          cache.set(cacheKey, quotesArray, 60); // Cache prices for 60 seconds
        }
        
        quotesArray.forEach(q => {
          marketData[q.symbol] = {
            currentPrice: q.regularMarketPrice,
            previousClose: q.regularMarketPreviousClose,
            change: q.regularMarketChange,
            changePercent: q.regularMarketChangePercent,
            dividendYield: q.trailingAnnualDividendYield || 0,
            dividendRate: q.trailingAnnualDividendRate || 0,
            beta: q.beta || null,
            trailingPE: q.trailingPE || null,
            eps: q.epsTrailingTwelveMonths || null
          };
        });

        // Fetch quoteSummary for sectors concurrently
        await Promise.all(symbols.map(async (sym) => {
          const summaryKey = `summary_${sym}`;
          let qs = cache.get(summaryKey);
          
          if (!qs) {
            try {
              qs = await yahooFinance.quoteSummary(sym, { modules: ['assetProfile'] });
              cache.set(summaryKey, qs, 3600); // Cache sector data for 1 hour
            } catch (e) {
              qs = { assetProfile: { sector: 'Unknown' } };
            }
          }
          
          quoteSummaries[sym] = {
            sector: qs.assetProfile?.sector || 'Unknown',
            website: qs.assetProfile?.website || null
          };
        }));
      }
    } catch (err) {
      console.error('Failed to fetch market data:', err.message);
    }

    const liveUsdThb = marketData['USDTHB=X']?.currentPrice || 35.0; // fallback
    const liveIvv = marketData['IVV']?.currentPrice || 500.0; // fallback

    // Combine holdings with live data and analytics
    const enrichedHoldings = holdings.map(h => {
      const liveData = marketData[h.symbol] || {};
      const currentPrice = liveData.currentPrice || h.averageCost;
      const totalValue = h.totalShares * currentPrice;
      const unrealizedPl = totalValue - h.totalCost;
      const unrealizedPlPercent = h.totalCost > 0 ? (unrealizedPl / h.totalCost) * 100 : 0;
      
      // Yield on Cost (YOC)
      const annualDividend = (liveData.dividendRate || 0) * h.totalShares;
      const yieldOnCost = h.totalCost > 0 ? (annualDividend / h.totalCost) * 100 : 0;
      
      return {
        ...h,
        currentPrice,
        totalValue,
        unrealizedPl,
        unrealizedPlPercent,
        marketData: liveData,
        sector: quoteSummaries[h.symbol]?.sector || 'Unknown',
        website: quoteSummaries[h.symbol]?.website || null,
        annualDividend,
        yieldOnCost
      };
    });

    // Calculate Portfolio Summary
    const summary = {
      totalValue: 0,
      totalCost: totalPortfolioCost,
      totalUnrealizedPl: 0,
      totalUnrealizedPlPercent: 0,
      dayGain: 0,
      dayGainPercent: 0,
      totalDividends: 0,
      benchmarkTotalValue: 0,
      liveUsdThb,
      portfolioBeta: 0,
      portfolioPE: 0,
      totalRealizedPl: 0,
      winRate: 0,
      topPerformer: null
    };

    let previousValue = 0;
    let globalTotalCostInThb = 0;
    let totalBetaWeight = 0;
    let portfolioBetaSum = 0;
    let totalPEWeight = 0;
    let portfolioPESum = 0;
    let globalWinCount = 0;
    let globalLossCount = 0;
    let bestPerformer = null;

    enrichedHoldings.forEach(h => {
      summary.totalValue += h.totalValue;
      summary.totalDividends += h.annualDividend;
      globalTotalCostInThb += h.totalCostInThb;
      
      // Benchmark tracking (Total IVV shares we hypothetically hold)
      summary.benchmarkTotalValue += h.benchmarkCost * liveIvv;
      
      const prevPrice = h.marketData.previousClose || h.currentPrice;
      previousValue += h.totalShares * prevPrice;

      if (h.marketData.beta) {
        portfolioBetaSum += h.marketData.beta * h.totalValue;
        totalBetaWeight += h.totalValue;
      }
      if (h.marketData.trailingPE) {
        portfolioPESum += h.marketData.trailingPE * h.totalValue;
        totalPEWeight += h.totalValue;
      }

      summary.totalRealizedPl += h.totalRealizedPl || 0;
      globalWinCount += h.winCount || 0;
      globalLossCount += h.lossCount || 0;

      if (!bestPerformer || h.unrealizedPlPercent > bestPerformer.percent) {
        bestPerformer = { symbol: h.symbol, percent: h.unrealizedPlPercent };
      }
    });

    summary.portfolioBeta = totalBetaWeight > 0 ? portfolioBetaSum / totalBetaWeight : 1;
    summary.portfolioPE = totalPEWeight > 0 ? portfolioPESum / totalPEWeight : 0;
    
    const totalClosed = globalWinCount + globalLossCount;
    summary.winRate = totalClosed > 0 ? (globalWinCount / totalClosed) * 100 : 0;
    summary.topPerformer = bestPerformer;

    summary.totalUnrealizedPl = summary.totalValue - summary.totalCost;
    if (summary.totalCost > 0) {
      summary.totalUnrealizedPlPercent = (summary.totalUnrealizedPl / summary.totalCost) * 100;
    }

    summary.dayGain = summary.totalValue - previousValue;
    if (previousValue > 0) {
      summary.dayGainPercent = (summary.dayGain / previousValue) * 100;
    }

    const sortedByPl = [...enrichedHoldings].filter(h => h.totalValue > 0).sort((a, b) => b.unrealizedPlPercent - a.unrealizedPlPercent);
    summary.topGainers = sortedByPl.filter(h => h.unrealizedPlPercent > 0).slice(0, 3);
    summary.topLosers = sortedByPl.filter(h => h.unrealizedPlPercent < 0).reverse().slice(0, 3);

    const smartAlerts = [];
    const sectorWeights = {};
    enrichedHoldings.filter(h => h.totalValue > 0).forEach(h => {
        if (!sectorWeights[h.sector]) sectorWeights[h.sector] = 0;
        sectorWeights[h.sector] += h.totalValue;
    });
    
    for (const [sector, value] of Object.entries(sectorWeights)) {
        const weight = (value / summary.totalValue) * 100;
        if (weight > 40 && sector !== 'Unknown') {
            smartAlerts.push({
                type: 'warning',
                message: `${sector} sector exceeds 40% of the portfolio (${weight.toFixed(1)}%) — review for rebalancing.`
            });
        }
    }
    
    const taxLossCandidates = enrichedHoldings.filter(h => h.unrealizedPlPercent < -15 && h.totalValue > 0);
    if (taxLossCandidates.length > 0) {
        smartAlerts.push({
            type: 'info',
            message: `Tax-Loss Harvesting Opportunity: ${taxLossCandidates.map(h => h.symbol).join(', ')} down > 15%.`
        });
    }

    summary.smartAlerts = smartAlerts;
    summary.currentMonthInvested = currentMonthInvested;
    summary.fxImpactPercent = globalTotalCostInThb > 0 ? (((summary.totalCost * liveUsdThb) - globalTotalCostInThb) / globalTotalCostInThb) * 100 : 0;

    res.json({
      summary,
      holdings: enrichedHoldings,
      rawTransactions: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a transaction
router.post('/', async (req, res) => {
  try {
    const { symbol, type = 'BUY', shares, buyPrice, tradeDate, portfolioId } = req.body;
    const newTransaction = new Transaction({
      symbol: symbol.toUpperCase(),
      type,
      shares,
      buyPrice,
      tradeDate,
      portfolioId
    });

    // Fetch historical data asynchronously before saving
    try {
      const [fxRate, ivvPrice] = await Promise.all([
        getHistoricalClose('USDTHB=X', tradeDate),
        getHistoricalClose('IVV', tradeDate)
      ]);
      if (fxRate) newTransaction.exchangeRateAtTrade = fxRate;
      if (ivvPrice) newTransaction.benchmarkPriceAtTrade = ivvPrice;
    } catch (e) {
      console.error('Warning: could not fetch historical data for transaction', e.message);
    }

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error adding transaction', error: error.message });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { symbol, type = 'BUY', shares, buyPrice, tradeDate, portfolioId } = req.body;
    
    // We might need to refetch historical data if tradeDate changed
    let fxRate = req.body.exchangeRateAtTrade;
    let ivvPrice = req.body.benchmarkPriceAtTrade;
    
    // Simplification: Always refetch to be safe on update
    try {
      const [newFx, newIvv] = await Promise.all([
        getHistoricalClose('USDTHB=X', tradeDate),
        getHistoricalClose('IVV', tradeDate)
      ]);
      if (newFx) fxRate = newFx;
      if (newIvv) ivvPrice = newIvv;
    } catch (e) {
      console.error('Warning: could not refetch historical data for update', e.message);
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id, 
      { symbol: symbol.toUpperCase(), type, shares, buyPrice, tradeDate, portfolioId, exchangeRateAtTrade: fxRate, benchmarkPriceAtTrade: ivvPrice },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

export default router;
