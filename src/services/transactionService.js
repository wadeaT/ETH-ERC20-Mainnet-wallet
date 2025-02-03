// src/services/transactionService.js
import { ethers } from 'ethers';
import rpcProvider from '@/lib/rpcProvider';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address, uint256) returns (bool)'
];

export async function getTokenBalance(contractAddress, walletAddress) {
  try {
    const provider = rpcProvider.provider;

    if (!contractAddress) {
      return ethers.formatEther(
        await provider.getBalance(walletAddress)
      );
    }

    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    const [balance, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals()
    ]);
    
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Balance fetch error:', error);
    return '0';
  }
}

export async function sendTransaction(toAddress, amount, token) {
  if (!ethers.isAddress(toAddress)) {
    throw new Error('Invalid Ethereum address');
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    throw new Error('Please enter a valid amount');
  }

  const privateKey = window.localStorage.getItem('privateKey');
  if (!privateKey) {
    throw new Error('Private key not found. Please reconnect your wallet.');
  }

  const provider = rpcProvider.provider;
  const wallet = new ethers.Wallet(privateKey, provider);

  if (!token.contractAddress) {
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount)
    });
    return await tx.wait();
  }

  const contract = new ethers.Contract(token.contractAddress, ERC20_ABI, wallet);
  const decimals = await contract.decimals();
  const tx = await contract.transfer(
    toAddress, 
    ethers.parseUnits(amount, decimals)
  );
  return await tx.wait();
}

export function formatTransactions(transactions, walletAddress) {
  return transactions.map(tx => {
    const isToken = 'tokenSymbol' in tx;
    const baseTransaction = {
      hash: tx.hash,
      type: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in',
      from: tx.from,
      to: tx.to,
      date: new Date(parseInt(tx.timeStamp) * 1000),
      status: tx.isError === '0' ? 'completed' : 'failed',
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice
    };

    if (isToken) {
      return {
        ...baseTransaction,
        token: tx.tokenSymbol || 'Unknown Token',
        amount: ethers.formatUnits(tx.value, tx.tokenDecimal)
      };
    }

    return {
      ...baseTransaction,
      token: 'ETH',
      amount: ethers.formatEther(tx.value)
    };
  });
}