import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const quotes = await yahooFinance.quote(['AAPL']);
    console.log(JSON.stringify(quotes, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
