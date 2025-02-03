// src/app/dashboard/history/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { TransactionFilters } from '@/components/transaction/TransactionFilters';
import { TransactionTable } from '@/components/transaction/TransactionTable';
import { formatTransactions } from '@/services/transactionService';
import { SecurityNotice } from '@/components/common/SecurityNotice';
import { Inbox } from 'lucide-react'; // Import for empty state icon

export default function HistoryPage() {
  const [state, setState] = useState({
    transactions: [],
    loading: true,
    error: null,
    searchQuery: '',
    filterType: 'all',
    showFilter: false
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const walletAddress = localStorage.getItem('walletAddress');
        if (!walletAddress) {
          throw new Error('Wallet not connected');
        }

        const response = await fetch(`/api/transactions?address=${walletAddress}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch transactions');
        }

        const allTransactions = formatTransactions(
          [...(data.normal || []), ...(data.token || [])],
          walletAddress
        ).sort((a, b) => b.date - a.date);

        setState(prev => ({
          ...prev,
          transactions: allTransactions,
          loading: false,
          error: null
        }));
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to load transaction history',
          loading: false
        }));
      }
    };

    fetchTransactions();

    // Add cleanup function
    return () => {
      setState({
        transactions: [],
        loading: true,
        error: null,
        searchQuery: '',
        filterType: 'all',
        showFilter: false
      });
    };
  }, []);

  const { transactions, loading, error, searchQuery, filterType, showFilter } = state;

  // Filter transactions based on search query and filter type
  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (!searchQuery) return true;
    
    const search = searchQuery.toLowerCase();
    return (
      tx.hash.toLowerCase().includes(search) ||
      tx.from.toLowerCase().includes(search) ||
      tx.to.toLowerCase().includes(search) ||
      tx.token.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const showEmptyState = !error && (!transactions.length || !filteredTransactions.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
        
        {transactions.length > 0 && (
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={(value) => setState(prev => ({ 
              ...prev, 
              searchQuery: value 
            }))}
            filterType={filterType}
            onFilterChange={(value) => setState(prev => ({ 
              ...prev, 
              filterType: value,
              showFilter: false
            }))}
            showFilter={showFilter}
            onToggleFilter={() => setState(prev => ({ 
              ...prev, 
              showFilter: !prev.showFilter 
            }))}
          />
        )}
      </div>

      {error && <SecurityNotice type="error">{error}</SecurityNotice>}

      {showEmptyState ? (
        <Card className="p-8 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Transactions Found</h3>
            <p className="text-muted-foreground max-w-sm">
              {!transactions.length 
                ? "You haven't made any transactions yet. Your transaction history will appear here."
                : "No transactions match your current filters. Try adjusting your search criteria."}
            </p>
          </div>
        </Card>
      ) : (
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
      )}
    </div>
  );
}