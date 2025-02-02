// src/app/dashboard/history/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { TransactionFilters } from '@/components/transaction/TransactionFilters';
import { TransactionTable } from '@/components/transaction/TransactionTable';
import { formatEthTransactions, formatTokenTransactions } from '@/lib/utils/transaction';

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

export default function HistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const walletAddress = window.localStorage.getItem('walletAddress');
        if (!walletAddress) {
          setLoading(false);
          return;
        }

        const [normalTxs, tokenTxs] = await Promise.all([
          fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`).then(r => r.json()),
          fetch(`https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`).then(r => r.json())
        ]);

        const allTxs = [
          ...formatEthTransactions(normalTxs.result || [], walletAddress),
          ...formatTokenTransactions(tokenTxs.result || [], walletAddress)
        ].sort((a, b) => b.date - a.date);

        setTransactions(allTxs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
        <TransactionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          showFilter={showFilter}
          onToggleFilter={() => setShowFilter(!showFilter)}
        />
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
            <TransactionTable transactions={filteredTransactions} />
          </table>
        </div>
      </Card>
    </div>
  );
}