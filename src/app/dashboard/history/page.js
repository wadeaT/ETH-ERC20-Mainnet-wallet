// src/app/dashboard/history/page.js
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
  const [filterType, setFilterType] = useState('all');
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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-background/50 border border-input rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
          
          <div className="relative">
            <button 
              className="p-2 bg-background/50 border border-input rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter size={18} />
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                <div className="p-2 space-y-1">
                  <button 
                    className={`w-full text-left px-4 py-2 rounded ${filterType === 'all' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => {
                      setFilterType('all');
                      setShowFilter(false);
                    }}
                  >
                    All Transactions
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded ${filterType === 'in' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    onClick={() => {
                      setFilterType('in');
                      setShowFilter(false);
                    }}
                  >
                    Incoming
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded ${filterType === 'out' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
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

      <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-4 text-muted-foreground font-medium">Type</th>
                <th className="p-4 text-muted-foreground font-medium">Token</th>
                <th className="p-4 text-muted-foreground font-medium">Amount</th>
                <th className="p-4 text-muted-foreground font-medium">From</th>
                <th className="p-4 text-muted-foreground font-medium">To</th>
                <th className="p-4 text-muted-foreground font-medium">Date</th>
                <th className="p-4 text-muted-foreground font-medium">Status</th>
                <th className="p-4 text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((tx) => (
                <tr key={tx.hash} className="text-sm hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'in' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                      }`}>
                        {tx.type === 'in' ? '↓' : '↑'}
                      </div>
                      <span className="text-foreground capitalize">
                        {tx.type === 'in' ? 'Received' : 'Sent'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-foreground text-xs">
                          {tx.token === 'ETH' ? 'Ξ' : tx.token[0]}
                        </span>
                      </div>
                      <span className="text-foreground">{tx.token}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={tx.type === 'in' ? 'text-success' : 'text-destructive'}>
                      {tx.type === 'in' ? '+' : '-'}{parseFloat(tx.amount).toFixed(6)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">
                        {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                      </span>
                      <ExternalLink 
                        size={14} 
                        className="text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => window.open(`https://etherscan.io/address/${tx.from}`, '_blank')}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">
                        {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                      </span>
                      <ExternalLink 
                        size={14} 
                        className="text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => window.open(`https://etherscan.io/address/${tx.to}`, '_blank')}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDistanceToNow(tx.date, { addSuffix: true })}
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      tx.status === 'completed' 
                        ? 'bg-success/20 text-success'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <ExternalLink 
                      size={14} 
                      className="text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                    />
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-muted-foreground">
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