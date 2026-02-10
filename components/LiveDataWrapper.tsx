"use client";

import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";
import CoinHeader from "./CoinHeader";
import { useLiveInterval } from "@/context/LiveIntervalContext";

const LiveDataWrapper = ({ coinId, coin, ohlcv, symbol }: LiveDataProps) => {
  const { liveInterval, setLiveInterval } = useLiveInterval();

  const { ohlcvData, price } = useBinanceWebSocket({
    interval: liveInterval,
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
      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart
          liveOhlcv={ohlcvData}
          height={400}
          initialPeriod="daily"
          mode="live"
          coinId={coinId}
          data={ohlcv}
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>
      <Separator className="divider" />
      {/* {children} */}

      {/* {trades.length > 0 && (
        <div className="trades">
          <h4>Recent Trades</h4>
          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, i) => i}
            tableClassName="trades-table"
          />
        </div>
      )} */}
    </section>
  );
};

export default LiveDataWrapper;
