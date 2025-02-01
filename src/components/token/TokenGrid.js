// src/components/token/TokenGrid.js
'use client';

import { TokenCard } from './TokenCard';
import { useWallet } from '@/hooks/useWallet'; 

export const TokenGrid = ({ tokens, hasWallet }) => {
 const { walletData } = useWallet();

 return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
     {tokens.map((token) => (
       <TokenCard
         key={token.id}
         token={token}
         price={token.price}
         change={token.change24h}
         balance={hasWallet ? walletData?.balances?.[token.symbol] || '0' : null}
         icon={token.binanceSymbol ? `https://bin.bnbstatic.com/image/token/${token.binanceSymbol.toUpperCase()}.png` : null}
       />
     ))}
   </div>
 );
};