// src/lib/constants/tokens.js - UPDATED TOKEN LIST
export const DEFAULT_ICONS = {
  'ETH': '⟠',
  'USDC': '💲',
  'STETH': '⟠',
  'LINK': '⬡',
  'WBTC': '₿',
  'TON': '💎',
  'WETH': '⟠',
  'SHIB': '🐕',
  'LEO': '🦁',
  'UNI': '🦄',
  'WBETH': '⟠',
  'DAI': '◈'
};

export const SUPPORTED_TOKENS = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    binanceSymbol: 'ETHUSDT',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    fallbackIcon: DEFAULT_ICONS.ETH,
    decimals: 18,
    isERC20: false
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    binanceSymbol: 'USDCUSDT',
    icon: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    fallbackIcon: DEFAULT_ICONS.USDC,
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    isERC20: true,
    priceFallback: 'stable'
  },
  {
    id: 'steth',
    symbol: 'STETH',
    name: 'Staked Ether',
    binanceSymbol: 'STETHUSDT',
    icon: 'https://assets.coingecko.com/coins/images/13442/small/steth_logo.png',
    fallbackIcon: DEFAULT_ICONS.STETH,
    contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    binanceSymbol: 'LINKUSDT',
    icon: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    fallbackIcon: DEFAULT_ICONS.LINK,
    contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'wrapped-bitcoin',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    binanceSymbol: 'WBTCUSDT',
    icon: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    fallbackIcon: DEFAULT_ICONS.WBTC,
    contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 8,
    isERC20: true
  },
  {
    id: 'the-open-network',
    symbol: 'TON',
    name: 'TON Coin',
    binanceSymbol: 'TONUSDT',
    icon: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    fallbackIcon: DEFAULT_ICONS.TON,
    decimals: 9,
    isERC20: false
  },
  {
    id: 'weth',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    binanceSymbol: 'WETHUSDT',
    icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    fallbackIcon: DEFAULT_ICONS.WETH,
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'shiba-inu',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    binanceSymbol: 'SHIBUSDT',
    icon: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
    fallbackIcon: DEFAULT_ICONS.SHIB,
    contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'leo-token',
    symbol: 'LEO',
    name: 'UNUS SED LEO',
    binanceSymbol: 'LEOUSDT',
    icon: 'https://assets.coingecko.com/coins/images/8418/small/leo-token.png',
    fallbackIcon: DEFAULT_ICONS.LEO,
    contractAddress: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    binanceSymbol: 'UNIUSDT',
    icon: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    fallbackIcon: DEFAULT_ICONS.UNI,
    contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'wrapped-beacon-eth',
    symbol: 'WBETH',
    name: 'Wrapped Beacon ETH',
    binanceSymbol: 'WBETHUSDT',
    icon: 'https://assets.coingecko.com/coins/images/30061/small/wbeth-icon.png',
    fallbackIcon: DEFAULT_ICONS.WBETH,
    contractAddress: '0xa2e3356610840701bdf5611a53974510ae27e2e1',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai',
    binanceSymbol: 'DAIUSDT',
    icon: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
    fallbackIcon: DEFAULT_ICONS.DAI,
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    isERC20: true,
    priceFallback: 'stable'
  }
];

export const PRICE_CONFIG = {
  stableCoins: ['USDC', 'DAI'],
  backupPairs: {
    WETH: 'ETH_USD',
    STETH: 'ETH_USD',
    WBETH: 'ETH_USD'
  },
  alternativeAPIs: [
    'https://api.binance.us/api/v3',
    'https://api.kucoin.com/api/v1'
  ]
};