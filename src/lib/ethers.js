// lib/ethers.js
import { ethers } from 'ethers';

let provider = null;

export const getProvider = () => {
  if (provider) return provider;
  
  const providerUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
  if (!providerUrl) {
    console.error('No RPC URL provided');
    return null;
  }
  
  provider = new ethers.JsonRpcProvider(providerUrl);
  return provider;
};

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)'
];

export const getTokenBalance = async (contractAddress, walletAddress) => {
  try {
    console.log('Fetching balance for:', walletAddress);
    const provider = getProvider();
    
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    if (!contractAddress) {
      // For ETH balance
      const balance = await provider.getBalance(walletAddress);
      const ethBalance = ethers.formatEther(balance);
      console.log('ETH Balance:', ethBalance);
      return ethBalance;
    }
    
    // For ERC20 tokens
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    const tokenBalance = ethers.formatUnits(balance, decimals);
    console.log('Token Balance:', tokenBalance);
    return tokenBalance;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
};

export const sendTransaction = async (privateKey, toAddress, amount, token) => {
  try {
    const provider = getProvider();
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    // Validate private key
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Invalid private key');
    }

    // Validate amount
    if (!amount || isNaN(parseFloat(amount))) {
      throw new Error('Invalid amount');
    }

    // Create wallet instance from private key
    console.log('Creating wallet instance...');
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log('Sending from address:', wallet.address);

    let tx;
    if (!token.contractAddress) {
      // Send ETH
      console.log('Sending ETH amount:', amount);
      const parsedAmount = ethers.parseEther(amount);
      console.log('Parsed amount:', parsedAmount.toString());
      
      tx = await wallet.sendTransaction({
        to: toAddress,
        value: parsedAmount
      });
    } else {
      // Send ERC20 token
      console.log('Sending token amount:', amount);
      const contract = new ethers.Contract(token.contractAddress, ERC20_ABI, wallet);
      const decimals = await contract.decimals();
      const tokenAmount = ethers.parseUnits(amount, decimals);
      console.log('Parsed token amount:', tokenAmount.toString());
      
      tx = await contract.transfer(toAddress, tokenAmount);
    }

    console.log('Transaction hash:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    return receipt;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};