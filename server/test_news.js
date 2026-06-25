import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const res = await yahooFinance.search('AAPL', { newsCount: 1 });
    const news = res.news[0];
    console.log("type:", typeof news.providerPublishTime);
    console.log("value:", news.providerPublishTime);
    console.log("isDate:", news.providerPublishTime instanceof Date);
  } catch(e) {
    console.error(e);
  }
}
test();
