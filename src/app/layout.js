// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from './ClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

export const metadata = {
  title: "ETH Wallet Hub",
  description: "Manage your Ethereum wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <ThemeProvider>
            <div className={`${inter.variable} font-sans antialiased`}>
              <ClientProvider>{children}</ClientProvider>
            </div>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}