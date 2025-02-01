// src/lib/wallet-utils.js
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address, uint256) returns (bool)'
];

export const initializeProvider = () => {
  const providerUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
  if (!providerUrl) throw new Error('RPC URL not configured');
  return new ethers.JsonRpcProvider(providerUrl);
};

export const validateWalletSetup = () => {
  const username = localStorage.getItem('username');
  const walletAddress = localStorage.getItem('walletAddress');
  
  if (!username || !walletAddress) {
    throw new Error('Wallet not properly set up');
  }
  
  try {
    return {
      username,
      walletAddress: ethers.getAddress(walletAddress) // Ensures checksum address
    };
  } catch (error) {
    throw new Error('Invalid wallet address');
  }
};

export const formatBalance = (balance, decimals = 6) => {
  try {
    const value = parseFloat(balance);
    if (isNaN(value)) return '0.00';
    return value.toFixed(decimals);
  } catch {
    return '0.00';
  }
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getTokenBalance = async (provider, tokenAddress, walletAddress, decimals = 18) => {
  try {
    if (!tokenAddress) {
      const balance = await provider.getBalance(walletAddress);
      return ethers.formatEther(balance);
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
};