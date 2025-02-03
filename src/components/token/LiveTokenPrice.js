// /src/components/token/LiveTokenPrice.js
import { useState, useEffect } from 'react';
import { priceWs } from '@/services/priceWebSocket';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function LiveTokenPrice({ token, showChange = true }) {
  const [price, setPrice] = useState(token.price);
  const [priceChange, setPriceChange] = useState(token.priceChange);
  const [increasing, setIncreasing] = useState(false);

  useEffect(() => {
    if (!token?.binanceSymbol) return;

    const unsubscribe = priceWs.subscribe(
      token.binanceSymbol,
      (data) => {
        setIncreasing(data.price > price);
        setPrice(data.price);
        setPriceChange(data.priceChange);
      }
    );

    return () => unsubscribe();
  }, [token?.binanceSymbol]);

  return (
    <div className="text-right">
      <motion.p
        key={price}
        initial={{ opacity: 0.5, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        ${formatNumber(price)}
      </motion.p>
      {showChange && (
        <p className={priceChange >= 0 ? 'text-success' : 'text-destructive'}>
          {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange)}%
        </p>
      )}
      {increasing && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 right-0 text-success"
        >
          ↑
        </motion.div>
      )}
    </div>
  );
}