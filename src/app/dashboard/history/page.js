'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, ChevronDown, ExternalLink, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'in', 'out'
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const walletAddress = window.localStorage.getItem('walletAddress');
        if (!walletAddress) {
          console.error('No wallet address found');
          setLoading(false);
          return;
        }

        // Fetch both normal ETH transactions and ERC20 token transfers
        const [normalTxResponse, tokenTxResponse] = await Promise.all([
          fetch(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
          ),
          fetch(
            `https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
          )
        ]);

        const [normalTxData, tokenTxData] = await Promise.all([
          normalTxResponse.json(),
          tokenTxResponse.json()
        ]);

        let allTx = [];

        // Process ETH transactions
        if (normalTxData.status === '1') {
          const ethTx = normalTxData.result.map(tx => ({
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
          allTx = [...allTx, ...ethTx];
        }

        // Process token transactions
        if (tokenTxData.status === '1') {
          const tokenTx = tokenTxData.result.map(tx => ({
            hash: tx.hash,
            type: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'out' : 'in',
            token: tx.tokenSymbol,
            amount: ethers.formatUnits(tx.value, parseInt(tx.tokenDecimal)),
            from: tx.from,
            to: tx.to,
            date: new Date(parseInt(tx.timeStamp) * 1000),
            status: 'completed',
            contractAddress: tx.contractAddress
          }));
          allTx = [...allTx, ...tokenTx];
        }

        // Sort by date (newest first)
        allTx.sort((a, b) => b.date - a.date);
        setTransactions(allTx);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      tx.hash.toLowerCase().includes(searchLower) ||
      tx.from.toLowerCase().includes(searchLower) ||
      tx.to.toLowerCase().includes(searchLower) ||
      tx.token.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <div className="relative">
            <button 
              className="p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 hover:text-white"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter size={18} />
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
                <div className="p-2 space-y-1">
                  <button 
                    className={`w-full text-left px-4 py-2 rounded ${filterType === 'all' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => {
                      setFilterType('all');
                      setShowFilter(false);
                    }}
                  >
                    All Transactions
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded ${filterType === 'in' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => {
                      setFilterType('in');
                      setShowFilter(false);
                    }}
                  >
                    Incoming
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded ${filterType === 'out' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => {
                      setFilterType('out');
                      setShowFilter(false);
                    }}
                  >
                    Outgoing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="bg-gray-800/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="p-4 text-gray-400 font-medium">Type</th>
                <th className="p-4 text-gray-400 font-medium">Token</th>
                <th className="p-4 text-gray-400 font-medium">Amount</th>
                <th className="p-4 text-gray-400 font-medium">From</th>
                <th className="p-4 text-gray-400 font-medium">To</th>
                <th className="p-4 text-gray-400 font-medium">Date</th>
                <th className="p-4 text-gray-400 font-medium">Status</th>
                <th className="p-4 text-gray-400 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.hash} className="text-sm hover:bg-gray-700/30">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'in' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.type === 'in' ? '↓' : '↑'}
                      </div>
                      <span className="text-white capitalize">
                        {tx.type === 'in' ? 'Received' : 'Sent'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">
                          {tx.token === 'ETH' ? 'Ξ' : tx.token[0]}
                        </span>
                      </div>
                      <span className="text-white">{tx.token}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={tx.type === 'in' ? 'text-green-400' : 'text-red-400'}>
                      {tx.type === 'in' ? '+' : '-'}{parseFloat(tx.amount).toFixed(6)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white">
                        {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                      </span>
                      <ExternalLink 
                        size={14} 
                        className="text-gray-400 cursor-pointer hover:text-white"
                        onClick={() => window.open(`https://etherscan.io/address/${tx.from}`, '_blank')}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white">
                        {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                      </span>
                      <ExternalLink 
                        size={14} 
                        className="text-gray-400 cursor-pointer hover:text-white"
                        onClick={() => window.open(`https://etherscan.io/address/${tx.to}`, '_blank')}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    {formatDistanceToNow(tx.date, { addSuffix: true })}
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      tx.status === 'completed' 
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <ExternalLink 
                      size={14} 
                      className="text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                    />
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}