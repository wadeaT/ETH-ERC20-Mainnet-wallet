// src/lib/constants/tokens.js
export const DEFAULT_ICONS = {
  'ETH': '⟠',
  'USDC': '💲',
  'LINK': '⚡',
  'WBTC': '₿',
  'TON': '💎',
  'UNI': '🦄',
  'WBETH': '⟠',
  'MKR': '🏦',
  'AAVE': '👻',
  'LDO': '🔷',
  'QNT': '🌐',
  'MANA': '🎮'
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
    name: 'Toncoin',
    binanceSymbol: 'TONUSDT',
    icon: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    fallbackIcon: DEFAULT_ICONS.TON,
    decimals: 9,
    isERC20: false
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
    id: 'maker',
    symbol: 'MKR',
    name: 'Maker',
    binanceSymbol: 'MKRUSDT',
    icon: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
    fallbackIcon: DEFAULT_ICONS.MKR,
    contractAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    binanceSymbol: 'AAVEUSDT',
    icon: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    fallbackIcon: DEFAULT_ICONS.AAVE,
    contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'lido-dao',
    symbol: 'LDO',
    name: 'Lido DAO',
    binanceSymbol: 'LDOUSDT',
    icon: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
    fallbackIcon: DEFAULT_ICONS.LDO,
    contractAddress: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'quant-network',
    symbol: 'QNT',
    name: 'Quant',
    binanceSymbol: 'QNTUSDT',
    icon: 'https://assets.coingecko.com/coins/images/3370/small/5ZOu7brX_400x400.jpg',
    fallbackIcon: DEFAULT_ICONS.QNT,
    contractAddress: '0x4a220e6096b25eadb88358cb44068a3248254675',
    decimals: 18,
    isERC20: true
  },
  {
    id: 'decentraland',
    symbol: 'MANA',
    name: 'Decentraland',
    binanceSymbol: 'MANAUSDT',
    icon: 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png',
    fallbackIcon: DEFAULT_ICONS.MANA,
    contractAddress: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    decimals: 18,
    isERC20: true
  }
];