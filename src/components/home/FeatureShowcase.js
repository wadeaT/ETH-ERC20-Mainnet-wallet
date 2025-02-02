// src/components/home/FeatureShowcase.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const showcaseItems = [
  {
    title: 'Secure Wallet Storage',
    description: 'State-of-the-art encryption and security measures to keep your assets safe.',
    icon: '🔒'
  },
  {
    title: 'Easy Token Transfers',
    description: 'Send and receive tokens with just a few clicks, simplified for everyone.',
    icon: '💸'
  },
  {
    title: 'Live Portfolio Tracking',
    description: 'Real-time updates and comprehensive portfolio management tools.',
    icon: '📊'
  }
];

export function FeatureShowcase() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrent((prev) => (prev + 1) % showcaseItems.length);
    } else {
      setCurrent((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-[400px] overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(1)}
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -200 : 200 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl mb-6"
                >
                  {showcaseItems[current].icon}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-4"
                >
                  {showcaseItems[current].title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground max-w-md mx-auto"
                >
                  {showcaseItems[current].description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {showcaseItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === current ? 'bg-primary' : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}