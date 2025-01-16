// lib/tokenConfig.js

// Price Feed Addresses from Chainlink on Ethereum Mainnet
// https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
export const tokens = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    coingeckoId: 'ethereum',
    priceAddress: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD
    decimals: 18
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    icon: '₮',
    coingeckoId: 'tether',
    priceAddress: '0x3e7d1eab13ad0104d2750b8863b489d65364e32d', // USDT/USD
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT token contract
    decimals: 6
  },
  {
    name: 'Shiba Inu',
    symbol: 'SHIB',
    icon: '🐕',
    coingeckoId: 'shiba-inu',
    priceAddress: '0x97bBF5A09Fd8355a3E1C88b409Bc0547859cF94B', // SHIB/USD
    contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', // SHIB token contract
    decimals: 18
  }
];