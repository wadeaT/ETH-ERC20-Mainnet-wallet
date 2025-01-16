'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ArrowDownUp } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { tokens } from '@/lib/tokenConfig';

export default function SwapPage() {
  const { walletData, loading, swapTokens } = useWallet();
  const [fromAmount, setFromAmount] = useState('0.0');
  const [toAmount, setToAmount] = useState('0.0');
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState('');

  // Get available tokens (tokens with balance > 0)
  const getAvailableTokens = () => {
    const available = [];
    
    // Add ETH if balance exists
    if (parseFloat(walletData.ethBalance) > 0) {
      available.push({
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        icon: 'Ξ',
        balance: walletData.ethBalance,
        price: walletData.assets.find(a => a.symbol === 'ETH')?.price || 0
      });
    }

    // Add other tokens with balance
    tokens.forEach(token => {
      const balance = walletData[`${token.symbol.toLowerCase()}Balance`];
      if (balance && parseFloat(balance) > 0) {
        available.push({
          id: token.id,
          symbol: token.symbol,
          name: token.name,
          icon: token.icon,
          balance: balance,
          price: walletData.assets.find(a => a.symbol === token.symbol)?.price || 0
        });
      }
    });

    return available;
  };

  // Get all possible destination tokens
  const getDestinationTokens = () => {
    const ethToken = {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      balance: walletData.ethBalance || '0',
      price: walletData.assets.find(a => a.symbol === 'ETH')?.price || 0
    };

    const allTokens = tokens.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      balance: walletData[`${token.symbol.toLowerCase()}Balance`] || '0',
      price: walletData.assets.find(a => a.symbol === token.symbol)?.price || 0
    }));

    return [ethToken, ...allTokens];
  };

  const availableTokens = getAvailableTokens();
  const destinationTokens = getDestinationTokens();

  // Initialize from/to tokens
  const [fromToken, setFromToken] = useState(availableTokens[0] || destinationTokens[0]);
  const [toToken, setToToken] = useState(destinationTokens.find(t => t.id !== fromToken.id) || destinationTokens[1]);

  // Handle token swap positions
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('0.0');
    setToAmount('0.0');
  };

  // Calculate exchange rate and amounts
  const calculateExchange = (amount, from, to) => {
    if (!from.price || !to.price || amount === '0.0') return '0.0';
    const rate = from.price / to.price;
    return (parseFloat(amount) * rate).toFixed(6);
  };

  // Update to amount when from amount changes
  useEffect(() => {
    const calculated = calculateExchange(fromAmount, fromToken, toToken);
    setToAmount(calculated);
  }, [fromAmount, fromToken, toToken]);

  // Handle the actual swap
  const handleSwap = async () => {
    setIsSwapping(true);
    setSwapError('');
    
    try {
      await swapTokens(fromToken, toToken, fromAmount, toAmount);
      setFromAmount('0.0');
      setToAmount('0.0');
    } catch (error) {
      setSwapError(error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-8">Swap Tokens</h1>

      <Card className="bg-gray-800/50 backdrop-blur-sm p-6 space-y-6">
        {/* From Token */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">From</label>
          <div className="relative">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button 
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
                onClick={() => setShowFromTokens(!showFromTokens)}
              >
                <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">{fromToken.icon}</span>
                </div>
                <span className="text-white">{fromToken.symbol}</span>
                <ChevronDown className="text-gray-400 w-4 h-4" />
              </button>

              {showFromTokens && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                  <div className="p-2 space-y-1">
                    {availableTokens.map(token => (
                      <button
                        key={token.id}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
                        onClick={() => {
                          setFromToken(token);
                          setShowFromTokens(false);
                          if (token.id === toToken.id) {
                            const nextToken = destinationTokens.find(t => t.id !== token.id);
                            if (nextToken) setToToken(nextToken);
                          }
                        }}
                      >
                        <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">{token.icon}</span>
                        </div>
                        <span className="text-white">{token.symbol}</span>
                        <span className="text-gray-400 text-sm ml-auto">
                          {parseFloat(token.balance).toFixed(4)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Balance: {parseFloat(fromToken.balance).toFixed(6)} {fromToken.symbol}</span>
            <button 
              className="text-blue-400 hover:text-blue-300"
              onClick={() => setFromAmount(fromToken.balance)}
            >
              Max
            </button>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleSwapTokens}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <ArrowDownUp className="text-gray-400 w-5 h-5" />
          </button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">To</label>
          <div className="relative">
            <input
              type="number"
              value={toAmount}
              readOnly
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button 
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
                onClick={() => setShowToTokens(!showToTokens)}
              >
                <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">{toToken.icon}</span>
                </div>
                <span className="text-white">{toToken.symbol}</span>
                <ChevronDown className="text-gray-400 w-4 h-4" />
              </button>

              {showToTokens && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                  <div className="p-2 space-y-1">
                    {destinationTokens
                      .filter(token => token.id !== fromToken.id)
                      .map(token => (
                        <button
                          key={token.id}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
                          onClick={() => {
                            setToToken(token);
                            setShowToTokens(false);
                          }}
                        >
                          <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">{token.icon}</span>
                          </div>
                          <span className="text-white">{token.symbol}</span>
                          <span className="text-gray-400 text-sm ml-auto">
                            {parseFloat(token.balance).toFixed(4)}
                          </span>
                        </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end text-sm text-gray-400">
            Balance: {parseFloat(toToken.balance).toFixed(6)} {toToken.symbol}
          </div>
        </div>

        {/* Exchange Info */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Exchange Rate</span>
            <span>1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Network Fee</span>
            <span>≈ $2.50</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Minimum Received</span>
            <span>{(parseFloat(toAmount) * 0.995).toFixed(6)} {toToken.symbol}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={fromAmount === '0.0' || parseFloat(fromAmount) > parseFloat(fromToken.balance) || isSwapping}
          onClick={handleSwap}
        >
          {isSwapping ? 'Swapping...' : 
           parseFloat(fromAmount) > parseFloat(fromToken.balance) ? 'Insufficient Balance' : 
           'Swap Tokens'}
        </Button>

        {swapError && (
          <div className="mt-2 text-red-400 text-sm">
            {swapError}
          </div>
        )}
      </Card>
    </div>
  );
}