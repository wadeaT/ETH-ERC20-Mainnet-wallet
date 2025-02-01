// src/lib/utils.js - IMPROVED FORMATTING FUNCTIONS
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  const number = parseFloat(num);
  if (isNaN(number)) return '0';

  if (number === 0) return '0';
  if (number >= 1e9) return (number / 1e9).toFixed(decimals) + 'B';
  if (number >= 1e6) return (number / 1e6).toFixed(decimals) + 'M';
  if (number >= 1e3) return (number / 1e3).toFixed(decimals) + 'K';
  return number.toFixed(decimals);
}

export function formatCryptoAmount(amount, decimals = 6) {
  if (!amount || isNaN(amount)) return '0';
  const num = parseFloat(amount);
  if (num < 0.000001) return '<0.000001';
  return num.toFixed(decimals);
}

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}