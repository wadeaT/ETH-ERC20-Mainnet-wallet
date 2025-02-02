// src/lib/utils/transaction.js
import { ethers } from 'ethers';

export function formatEthTransactions(transactions, walletAddress) {
  return transactions.map(tx => ({
    hash: tx.hash,
    type: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in',
    token: 'ETH',
    amount: ethers.formatEther(tx.value),
    from: tx.from,
    to: tx.to,
    date: new Date(parseInt(tx.timeStamp) * 1000),
    status: tx.isError === '0' ? 'completed' : 'failed',
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice
  }));
}

export function formatTokenTransactions(transactions, walletAddress) {
  return transactions.map(tx => ({
    hash: tx.hash,
    type: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in',
    token: tx.tokenSymbol || 'Unknown Token',
    amount: ethers.formatUnits(tx.value, tx.tokenDecimal),
    from: tx.from,
    to: tx.to,
    date: new Date(parseInt(tx.timeStamp) * 1000),
    status: tx.isError === '0' ? 'completed' : 'failed',
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice
  }));
}