# CoinFlux 🚀

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## 🔹 Project Overview

CoinFlux is a portfolio demo project showcasing live cryptocurrency prices, market capitalization, and trading analytics.

Built with Next.js 16, it leverages Tailwind CSS and shadcn/ui for a modern and responsive user interface.

Key features include viewing a list of coins, detailed coin pages with live charts, and real-time market and trading data.

For live updates, the project uses CoinGecko API for general market data and Binance WebSocket API for the latest trades and real-time prices.

## 🔹 Features

- Browse all cryptocurrencies ranked by market cap
- Detailed coin pages with live charts and market analytics
- Live Data:
  - Real-time trades
  - Latest coin prices
- Coin Converter for exchanging between cryptocurrencies
- Responsive and modern UI with ShadCN/UI and Tailwind CSS
- Interactive price charts powered by Lightweight Charts (TradingView)
- Lucide React icons for visual enhancements

## 🔹 Tech Stack

- **Next.js 16** – Server & Client Components
- **TypeScript** – Strongly typed JavaScript
- **Tailwind CSS** – Styling framework
- **ShadCN/UI** – Component library & design system
- **Lucide React** – Icons
- **Lightweight Charts (TradingView)** – Interactive charts
- **CoinGecko API** – Cryptocurrency market data
- **Binance WebSocket API** – Real-time trades and price updates

## 🔹 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/coinflux.git
cd coinflux
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_BINANCE_WS_URL=wss://stream.binance.com:9443/ws
```

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm run start
```
