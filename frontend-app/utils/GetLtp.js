import { stocks } from "./stocks.js";
const priceCache = {};

function getBasePrice(symbol) {
  const stock = stocks.find((s) => s.stockSymbol === symbol);
  return stock ? Number(stock.avgTradePrice) : null;
}

export function getLtp(symbol) {
  const basePrice = getBasePrice(symbol);
  if (!basePrice) return null;

  if (!priceCache[symbol]) {
    priceCache[symbol] = {
      price: basePrice,
      lastUpdate: Date.now(),
    };
  }

  const cache = priceCache[symbol];
  const now = Date.now();

  if (now - cache.lastUpdate > 3999) {
    const change = Math.random() * 20 - 10;
    cache.price = Math.max(1, cache.price + change);
    cache.lastUpdate = now;
  }

  const difference = cache.price - basePrice;
  const percentageDifference = (difference / basePrice) * 100;

  return {
    stockSymbol: symbol,
    givenPrice: basePrice,
    randomNumber: Number(cache.price.toFixed(2)),
    difference: Number(difference.toFixed(2)),
    percentageDifference: Number(percentageDifference.toFixed(2)),
    isDown: difference < 0,
  };
}
