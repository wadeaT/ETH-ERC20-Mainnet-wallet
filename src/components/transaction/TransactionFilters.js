// src/components/transaction/TransactionFilters.js
import { Search, Filter } from 'lucide-react';

export function TransactionFilters({ 
  searchQuery, 
  onSearchChange,
  filterType,
  onFilterChange,
  showFilter,
  onToggleFilter 
}) {
  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-initial">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64 bg-background/50 border border-input rounded-lg 
            pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground 
            focus:outline-none focus:border-primary"
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          size={18} 
        />
      </div>
      
      <div className="relative">
        <button 
          className="p-2 bg-background/50 border border-input rounded-lg 
            text-muted-foreground hover:text-foreground"
          onClick={onToggleFilter}
        >
          <Filter size={18} />
        </button>
        
        {showFilter && (
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border 
            rounded-lg shadow-lg overflow-hidden z-10"
          >
            <div className="p-2 space-y-1">
              {[
                { id: 'all', label: 'All Transactions' },
                { id: 'in', label: 'Incoming' },
                { id: 'out', label: 'Outgoing' }
              ].map(option => (
                <button 
                  key={option.id}
                  className={`w-full text-left px-4 py-2 rounded ${
                    filterType === option.id 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => {
                    onFilterChange(option.id);
                    onToggleFilter();
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}