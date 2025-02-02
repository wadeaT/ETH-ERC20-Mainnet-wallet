// src/lib/constants/coingecko-ids.js
export const COINGECKO_IDS = {
    ETH: 'ethereum',
    WETH: 'weth',
    USDC: 'usd-coin',
    USDT: 'tether',
    DAI: 'dai',
    WBTC: 'wrapped-bitcoin',
    LINK: 'chainlink',
    UNI: 'uniswap',
    SHIB: 'shiba-inu',
    STETH: 'staked-ether',
    WBETH: 'wrapped-beacon-eth',
    LEO: 'leo-token',
    TON: 'the-open-network'
  };
  
  // Map token symbols to their price references (for tokens that share prices)
  export const PRICE_REFERENCES = {
    WETH: 'ETH',  // WETH price follows ETH
    STETH: 'ETH', // STETH closely follows ETH
    WBETH: 'ETH'  // WBETH follows ETH
  };