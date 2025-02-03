// src/lib/utils/wallet.js
import { ethers } from 'ethers';
import { formatAddress, formatCryptoAmount } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address, uint256) returns (bool)'
];

// Provider initialization
export const initializeProvider = () => {
  const providerUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
  if (!providerUrl) throw new Error('RPC URL not configured');
  return new ethers.JsonRpcProvider(providerUrl);
};

// Wallet creation and restoration
export const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  };
};

export const connectWallet = async (username, password) => {
  const userDoc = await getDoc(doc(db, 'users', username));
  
  if (!userDoc.exists() || userDoc.data().password !== password) {
    throw new Error('Invalid username or password');
  }

  const userData = userDoc.data();
  const walletAddress = userData.ethAddress || userData.wallet?.address;

  if (!walletAddress || !ethers.isAddress(walletAddress)) {
    throw new Error('Invalid wallet data');
  }

  const data = {
    username,
    address: ethers.getAddress(walletAddress),
    privateKey: userData.encryptedKey || userData.wallet?.privateKey
  };

  saveWalletData(username, data);
  return data;
};

// Local storage management
export const saveWalletData = (username, walletData) => {
  localStorage.clear();
  localStorage.setItem('username', username);
  localStorage.setItem('walletAddress', walletData.address);
  if (walletData.privateKey) {
    localStorage.setItem('privateKey', walletData.privateKey);
  }
};

export const validateWalletSetup = () => {
  const username = localStorage.getItem('username');
  const walletAddress = localStorage.getItem('walletAddress');
  
  if (!username || !walletAddress) {
    throw new Error('Wallet not properly set up');
  }
  
  return { username, walletAddress: ethers.getAddress(walletAddress) };
};

// Token operations
export const getTokenBalance = async (provider, tokenAddress, walletAddress, decimals = 18) => {
  try {
    if (!tokenAddress) {
      const balance = await provider.getBalance(walletAddress);
      return formatCryptoAmount(ethers.formatEther(balance));
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return formatCryptoAmount(ethers.formatUnits(balance, decimals));
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
};

export const sendTransaction = async (privateKey, toAddress, amount, token) => {
  const provider = initializeProvider();
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
  const tx = await contract.transfer(toAddress, ethers.parseUnits(amount, decimals));
  return await tx.wait();
};