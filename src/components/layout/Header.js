// src/components/layout/Header.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ChevronLeft, Wallet } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export function Header({ showBackButton = false }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-background/80 backdrop-blur-md shadow-sm'
            : 'bg-background/50 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between h-14">
            {/* Left section */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="group hover:bg-primary/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="ml-1 text-sm">Back</span>
                </Button>
              )}
              
              <Link href="/">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-base font-semibold text-foreground hidden sm:block">
                    ETH Wallet Hub
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Right section */}
            <ThemeToggle />
          </div>
        </div>

        <div className="h-px bg-border/50" />
      </motion.header>

      {/* Spacer */}
      <div className="h-[64px]" />
    </>
  );
}