import express from 'express';
import YahooFinance from 'yahoo-finance2';
import cache from '../utils/cache.js';
const yahooFinance = new YahooFinance();

const router = express.Router();

// Get sector allocation heatmap data
router.post('/sectors', async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.json({ sectors: {} });
    }

    const sectorData = {};
    
    // Yahoo Finance API provides sector information via the quoteSummary module ('assetProfile')
    await Promise.all(symbols.map(async (symbol) => {
      try {
        const cacheKey = `summary_${symbol}`;
        let qs = cache.get(cacheKey);
        if (!qs) {
          qs = await yahooFinance.quoteSummary(symbol, { modules: ['assetProfile'] });
          cache.set(cacheKey, qs, 3600); // Cache sector for 1 hour
        }
        const sector = qs.assetProfile?.sector || 'Unknown';
        sectorData[symbol] = sector;
      } catch (err) {
        console.error(`Failed to fetch sector for ${symbol}`, err);
        sectorData[symbol] = 'Unknown';
      }
    }));

    res.json({ sectorData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching sectors' });
  }
});

// Search for a ticker symbol
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }
    const results = await yahooFinance.search(q);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching ticker' });
  }
});

// Get news for specific portfolio symbols
router.post('/news', async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.json({ news: [] });
    }

    let allNews = [];
    const uniqueIds = new Set();

    // Fetch news concurrently for all symbols
    const promises = symbols.map(async (symbol) => {
      try {
        const cacheKey = `news_${symbol}`;
        let result = cache.get(cacheKey);
        if (!result) {
          result = await yahooFinance.search(symbol, { newsCount: 5 });
          cache.set(cacheKey, result, 900); // Cache news for 15 minutes
        }
        
        if (result.news && Array.isArray(result.news)) {
          result.news.forEach(item => {
            // Deduplicate by uuid
            if (!uniqueIds.has(item.uuid)) {
              uniqueIds.add(item.uuid);
              allNews.push({ ...item, relatedSymbol: symbol });
            }
          });
        }
      } catch (err) {
        console.error(`Failed to fetch news for ${symbol}`, err);
      }
    });

    await Promise.all(promises);

    // Sort chronologically (newest first)
    allNews.sort((a, b) => {
      const timeA = a.providerPublishTime || 0;
      const timeB = b.providerPublishTime || 0;
      return timeB - timeA;
    });

    res.json({ news: allNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching news' });
  }
});

export default router;
