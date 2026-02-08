"use client";

import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";
import { useState } from "react";
import CoinHeader from "./CoinHeader";

const LiveDataWrapper = ({
  coinId,
  poolId,
  coin,
  ohlcv,
  children,
  symbol,
}: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<"1m" | "1s">("1m");

  const { trades, ohlcvData, price } = useBinanceWebSocket({
    interval: liveInterval,
    symbol: `${symbol.toUpperCase()}USDT`,
  });

  const tradeColumns: DataTableColumn<any>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span
          className={trade.type === "b" ? "text-green-500" : "text-red-500"}
        >
          {trade.type === "b" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  console.log(price);

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

      {trades.length > 0 && (
        <div className="trades">
          <h4>Recent Trades</h4>
          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, i) => i}
            tableClassName="trades-table"
          />
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
