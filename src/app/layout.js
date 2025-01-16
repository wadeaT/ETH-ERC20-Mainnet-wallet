import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from './ClientProvider'

const inter = Inter({
  subsets: ["latin"],
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