'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fetchTokenPrices } from '@/lib/api';

const TOKENS = {
  ETH: {
    symbol: 'ETH',
    contractAddress: null,
    decimals: 18
  },
  USDT: {
    symbol: 'USDT',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6
  },
  SHIB: {
    symbol: 'SHIB',
    contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    decimals: 18
  }
};

const ERC20_ABI = [
  'function transfer(address to, uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

const DEFAULT_TOKENS = [
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    balance: '0',
    decimals: 18
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    balance: '0',
    decimals: 6
  },
  {
    id: 'shib',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    icon: '🐕',
    balance: '0',
    decimals: 18
  }
];

export default function SendPage() {
  const router = useRouter();
  
  // Basic states
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [usdValue, setUsdValue] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [prices, setPrices] = useState(null);
  
  // Token states - initialize with default ETH token
  const [availableTokens, setAvailableTokens] = useState(DEFAULT_TOKENS);
  const [selectedToken, setSelectedToken] = useState(DEFAULT_TOKENS[0]);

  // Update USD value when amount changes
  const updateUsdValue = (tokenAmount) => {
    if (!prices || !tokenAmount) {
      setUsdValue('0.00');
      return;
    }

    const priceKey = selectedToken.symbol === 'ETH' 
      ? 'ethereum' 
      : selectedToken.symbol === 'USDT' 
        ? 'tether' 
        : 'shiba-inu';

    const price = prices[priceKey]?.usd || 0;
    const usd = parseFloat(tokenAmount) * price;
    setUsdValue(usd.toFixed(2));
  };

  // Handle amount input change
  const handleAmountChange = (value) => {
    setAmount(value);
    updateUsdValue(value);
  };

  // Initialize wallet and fetch prices
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const username = window.localStorage.getItem('username');
        const walletAddress = window.localStorage.getItem('walletAddress');
        
        if (!username || !walletAddress) {
          router.push('/connect-wallet');
          return;
        }

        // Get user data from Firebase
        const userDoc = await getDoc(doc(db, 'users', username));
        if (!userDoc.exists()) {
          throw new Error('Wallet not found');
        }

        const userData = userDoc.data();
        setWalletData(userData);

        // Initialize provider
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_RPC_URL);
        
        // Get balances
        const ethBalance = await provider.getBalance(walletAddress);
        const formattedEthBalance = ethers.formatEther(ethBalance);

        // Get token balances
        const usdtContract = new ethers.Contract(TOKENS.USDT.contractAddress, ERC20_ABI, provider);
        const shibContract = new ethers.Contract(TOKENS.SHIB.contractAddress, ERC20_ABI, provider);

        const [usdtBalance, shibBalance] = await Promise.all([
          usdtContract.balanceOf(walletAddress),
          shibContract.balanceOf(walletAddress)
        ]);

        const updatedTokens = [
          {
            ...DEFAULT_TOKENS[0],
            balance: formattedEthBalance
          },
          {
            ...DEFAULT_TOKENS[1],
            balance: ethers.formatUnits(usdtBalance, TOKENS.USDT.decimals)
          },
          {
            ...DEFAULT_TOKENS[2],
            balance: ethers.formatUnits(shibBalance, TOKENS.SHIB.decimals)
          }
        ];

        setAvailableTokens(updatedTokens);
        setSelectedToken(updatedTokens[0]);

        // Fetch initial prices
        const priceData = await fetchTokenPrices();
        setPrices(priceData);
      } catch (err) {
        console.error('Error initializing wallet:', err);
        setError('Failed to load wallet data');
      }
    };

    initializeWallet();

    // Update prices every 30 seconds
    const priceInterval = setInterval(async () => {
      try {
        const priceData = await fetchTokenPrices();
        setPrices(priceData);
        updateUsdValue(amount);
      } catch (err) {
        console.error('Error fetching prices:', err);
      }
    }, 30000);

    return () => clearInterval(priceInterval);
  }, []);

  // Format displayed balance based on token decimals
  const formatBalance = (balance, decimals) => {
    try {
      return parseFloat(balance).toFixed(decimals === 18 ? 6 : decimals);
    } catch {
      return '0';
    }
  };

  // Handle transaction submission
  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
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

      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_MAINNET_RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      let tx;
      if (selectedToken.symbol === 'ETH') {
        const parsedAmount = ethers.parseEther(amount);
        tx = await wallet.sendTransaction({
          to: toAddress,
          value: parsedAmount
        });
      } else {
        const tokenConfig = TOKENS[selectedToken.symbol];
        const contract = new ethers.Contract(
          tokenConfig.contractAddress,
          ERC20_ABI,
          wallet
        );

        const parsedAmount = ethers.parseUnits(amount, tokenConfig.decimals);
        tx = await contract.transfer(toAddress, parsedAmount);
      }

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      router.push('/dashboard');
    } catch (error) {
      console.error('Send error:', error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletData || !prices) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-8">Send {selectedToken.symbol}</h1>

      <Card className="bg-gray-800/50 backdrop-blur-sm p-6">
        <form onSubmit={handleSend} className="space-y-6">
          {/* Token Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Select Token</label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
                onClick={() => setShowTokenSelect(!showTokenSelect)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span>{selectedToken.icon}</span>
                  </div>
                  <span>{selectedToken.symbol}</span>
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </button>

              {showTokenSelect && (
                <div className="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-2 space-y-1">
                    {availableTokens.map(token => (
                      <button
                        key={token.id}
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
                        onClick={() => {
                          setSelectedToken(token);
                          setShowTokenSelect(false);
                          updateUsdValue(amount);
                        }}
                      >
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span>{token.icon}</span>
                        </div>
                        <span className="text-white">{token.symbol}</span>
                        <span className="text-gray-400 text-sm ml-auto">
                          Balance: {formatBalance(token.balance, token.decimals)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Amount Input with USD Value */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="any"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAmountChange(selectedToken.balance)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Max
                </button>
              </div>
              
              {/* USD Value Display */}
              <div className="flex justify-between items-center px-1">
                <p className="text-sm text-gray-400">
                  ≈ ${usdValue} USD
                </p>
                <p className="text-sm text-gray-400">
                  Balance: {formatBalance(selectedToken.balance, selectedToken.decimals)} {selectedToken.symbol}
                  {prices && selectedToken.balance && ` (≈ ${usdValue})`}
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !amount || !toAddress}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              'Send'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}