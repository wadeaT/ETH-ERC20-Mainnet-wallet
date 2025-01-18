# ETH Mainnet Wallet Manager

A comprehensive Ethereum wallet management application built as the final project for the **Advanced Web Technologies** course. This application enables users to manage their ETH and ERC20 tokens on the Ethereum Mainnet with a focus on **security**, **usability**, and **real-time data**.

---

## Features

### Wallet Management
- Create new ETH wallets with secure recovery phrases
- Restore existing wallets using recovery phrases
- Connect existing wallets
- View wallet balances and total portfolio value

### Token Support
- ETH (Ethereum) native token support
- ERC20 tokens support (e.g., USDT, SHIB, etc.)
- Real-time token prices
- Token balance visualization

### Transaction Features
- Send ETH and ERC20 tokens
- View detailed transaction history
- Real-time transaction status tracking
- Gas price estimation and management

---
## Technical Stack

### Frontend
- **Framework**: Next.js 15.1.4
- **UI Library**: React 18.2.0
- **Styling**: TailwindCSS 3.4.17
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Ethereum Interaction**: ethers.js 6.13.5, Web3.js 4.3.0


### Backend Services
- **Firebase**:
  - Authentication
  - Cloud Firestore
  - Hosting

### APIs & Integration
- Ethereum Mainnet
- CoinGecko API (Price data)
- Binance API (Fallback price data)
- WalletConnect

---

## Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Firebase account
- Ethereum node provider (Infura, Alchemy, or own node)

---
## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_MAINNET_RPC_URL=your_ethereum_node_url
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
```

---

## Installation

### Clone the repository:
```bash
git clone https://github.com/yourusername/eth-wallet-hub.git
cd eth-wallet-hub
```

### Install dependencies:
```bash
npm install
# or
yarn install
```

### Run the development server:
```bash
npm run dev
# or
yarn dev
```

---

## Firebase Setup

1. Create a new Firebase project.
2. Enable **Authentication** and **Firestore**.
3. Add a web app to your Firebase project.
4. Copy the configuration to your `.env.local` file.

---

## Contributing

This project was developed as part of an academic course. While it's not actively maintained, contributions are welcome. Feel free to fork and submit pull requests.
