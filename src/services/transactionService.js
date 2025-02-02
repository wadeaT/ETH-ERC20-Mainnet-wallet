// src/services/transactionService.js
import { ethers } from 'ethers';

const ERC20_ABI = [
  'function transfer(address to, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

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

  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_MAINNET_RPC_URL
  );
  const wallet = new ethers.Wallet(privateKey, provider);

  if (token.symbol === 'ETH') {
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount)
    });
    return await tx.wait();
  }

  const contract = new ethers.Contract(
    token.contractAddress,
    ERC20_ABI,
    wallet
  );
  const tx = await contract.transfer(
    toAddress, 
    ethers.parseUnits(amount, token.decimals)
  );
  return await tx.wait();
}