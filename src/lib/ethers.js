// src/lib/ethers.js
import { ethers } from 'ethers';
import rpcProvider from './rpcProvider';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address, uint256) returns (bool)'
];

export const getTokenBalance = async (contractAddress, walletAddress) => {
  try {
    if (!contractAddress) {
      return ethers.formatEther(
        await rpcProvider.call('getBalance', walletAddress)
      );
    }

    const provider = rpcProvider.provider;
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    const [balance, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals()
    ]);
    
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.warn('Balance fetch error:', error);
    return '0';
  }
};

export const sendTransaction = async (privateKey, toAddress, amount, token) => {
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
  const tx = await contract.transfer(toAddress, ethers.parseUnits(amount, decimals));
  return await tx.wait();
};