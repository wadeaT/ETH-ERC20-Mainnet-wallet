/*import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from './ClientProvider'

const inter = Inter({
  subsets: ["latin"],
  //display: 'swap', // I added this line
  variable: "--font-inter",
});

export const metadata = {
  title: "ETH Wallet Hub",
  description: "Manage your Ethereum wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
*/


import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from './ClientProvider';
import { Suspense } from 'react'; //this is new 

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
          <div className={`${inter.variable} font-sans antialiased`}>
            <ClientProvider>{children}</ClientProvider>
          </div>
        </Suspense>
      </body>
    </html>
  );
}