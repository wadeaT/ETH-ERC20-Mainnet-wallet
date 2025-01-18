// src/app/dashboard/receive/page.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ReceivePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [ethAddress, setEthAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const username = window.localStorage.getItem('username');
        if (!username) {
          router.push('/connect-wallet');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', username));
        if (!userDoc.exists()) {
          return;
        }

        const userData = userDoc.data();
        const address = userData.wallet?.address || userData.ethAddress || userData.address;
        
        if (address) {
          setEthAddress(address);
          window.localStorage.setItem('walletAddress', address);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletAddress();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ethAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Receive Tokens</h1>

      <Card className="bg-card/50 backdrop-blur-sm p-8">
        <div className="flex flex-col items-center space-y-6">
          {ethAddress && (
            <div className="bg-background p-4 rounded-lg">
              <QRCodeSVG 
                value={ethAddress}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          )}

          {/* Address Display */}
          <div className="w-full">
            <p className="text-muted-foreground text-sm mb-2 text-center">
              Your ETH Address
            </p>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <code className="text-foreground flex-1 text-center break-all">
                {ethAddress || 'No address found'}
              </code>
              {ethAddress && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy size={20} />
                </Button>
              )}
            </div>
            {copied && (
              <p className="text-success text-sm text-center mt-2">
                Address copied to clipboard!
              </p>
            )}
          </div>

          {/* Network Info */}
          <div className="w-full bg-muted/30 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground text-center">
              Send only ETH and ERC-20 tokens to this address. Sending other types of tokens may result in permanent loss.
            </p>
          </div>
        </div>
      </Card>

      {/* Network Selection */}
      <Card className="bg-card/50 backdrop-blur-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-foreground font-medium">Network</h3>
            <p className="text-muted-foreground text-sm">Ethereum Mainnet</p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
          >
            Change
          </Button>
        </div>
      </Card>
    </div>
  );
}