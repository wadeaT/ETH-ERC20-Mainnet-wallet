// src/components/transaction/TransactionTable.js
import { ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function TransactionTable({ transactions }) {
  if (!transactions?.length) {
    return (
      <tbody>
        <tr>
          <td colSpan="8" className="p-4 text-center text-muted-foreground">
            No transactions found
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-border">
      {transactions.map((tx) => (
        <tr key={tx.hash} className="text-sm hover:bg-muted/30">
          <td className="p-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                tx.type === 'in' 
                  ? 'bg-success/20 text-success' 
                  : 'bg-destructive/20 text-destructive'
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
          <AddressCell address={tx.from} />
          <AddressCell address={tx.to} />
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
            <a 
              href={`https://etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink size={14} />
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function AddressCell({ address }) {
  return (
    <td className="p-4">
      <div className="flex items-center gap-2">
        <span className="text-foreground">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <a 
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </td>
  );
}