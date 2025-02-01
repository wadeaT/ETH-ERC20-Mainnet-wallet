// lib/api.js
import { SUPPORTED_TOKENS } from './constants/tokens';

const PRICE_APIS = {
 COINGECKO: 'https://api.coingecko.com/api/v3',
 BINANCE: 'https://api.binance.com/api/v3',
 BACKUP: 'https://min-api.cryptocompare.com/data'
};

let priceCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 60 seconds cache

async function fetchCoinGeckoPrices() {
 const ids = SUPPORTED_TOKENS.map(token => token.id).join(',');
 const response = await fetch(
   `${PRICE_APIS.COINGECKO}/simple/price?ids=${ids}&vs_currencies=usd&include_24h_change=true`
 );

 if (!response.ok) throw new Error('CoinGecko API error');

 const data = await response.json();
 return SUPPORTED_TOKENS.reduce((acc, token) => {
   const priceData = data[token.id];
   if (priceData) {
     acc[token.symbol] = {
       usd: priceData.usd,
       usd_24h_change: priceData.usd_24h_change
     };
   }
   return acc;
 }, {});
}

async function fetchBinancePrices() {
 const symbols = SUPPORTED_TOKENS
   .filter(token => token.symbol !== 'ETH') // Skip ETH as we'll get from ETHUSDT
   .map(token => `${token.symbol}USDT`);

 const responses = await Promise.all(
   symbols.map(symbol => 
     fetch(`${PRICE_APIS.BINANCE}/ticker/24hr?symbol=${symbol}`)
   )
 );

 const data = await Promise.all(
   responses.map(response => response.json())
 );

 return SUPPORTED_TOKENS.reduce((acc, token, index) => {
   const tickerData = data[index];
   acc[token.symbol] = {
     usd: parseFloat(tickerData?.lastPrice) || 0,
     usd_24h_change: parseFloat(tickerData?.priceChangePercent) || 0
   };
   return acc;
 }, {});
}

export async function fetchTokenPrices() {
 try {
   // Check cache
   const now = Date.now();
   if (priceCache && now - lastFetchTime < CACHE_DURATION) {
     return priceCache;
   }

   // Try CoinGecko first
   try {
     const prices = await fetchCoinGeckoPrices();
     priceCache = prices;
     lastFetchTime = now;
     return prices;
   } catch (error) {
     console.log('CoinGecko failed, trying Binance...');
     const prices = await fetchBinancePrices();
     priceCache = prices;
     lastFetchTime = now;
     return prices;
   }

 } catch (error) {
   console.error('All price fetching attempts failed:', error);
   return priceCache || SUPPORTED_TOKENS.reduce((acc, token) => {
     acc[token.symbol] = { usd: 0, usd_24h_change: 0 };
     return acc;
   }, {});
 }
}