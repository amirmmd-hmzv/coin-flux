"use client";

import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import CandlestickChart from "./CandlestickChart";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({ coinId, coin, ohlcv, symbol }: LiveDataProps) => {
  const { price } = useBinanceWebSocket({
    symbol: `${symbol.toUpperCase()}USDT`,
  });

  return (
    <section id="live-data-wrapper" className="p-3">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ??
          coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={
          coin.market_data.price_change_percentage_30d_in_currency.usd
        }
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <br />
      <div className="trend">
        <CandlestickChart
          height={400}
          initialPeriod="daily"
          mode="live"
          coinId={coinId}
          data={ohlcv}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>
    </section>
  );
};

export default LiveDataWrapper;
