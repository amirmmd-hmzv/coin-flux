"use client";

import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import DataTable from "./DataTable";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { useLiveInterval } from "@/context/LiveIntervalContext";

interface RecentTradesSectionProps {
  symbol: string;
}

const RecentTradesSection = ({ symbol }: RecentTradesSectionProps) => {
  const { liveInterval, setLiveInterval } = useLiveInterval();

  const { trades } = useBinanceWebSocket({
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

  return (
    <>
      {trades.length > 0 && (
        <div className="trades w-full my-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4>Recent Trades</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setLiveInterval("1m")}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  liveInterval === "1m"
                    ? "bg-green-500 text-dark-900"
                    : "bg-dark-400 text-purple-100 hover:bg-dark-400/70"
                }`}
              >
                1m
              </button>
              <button
                onClick={() => setLiveInterval("7m")}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  liveInterval === "7m"
                    ? "bg-green-500 text-dark-900"
                    : "bg-dark-400 text-purple-100 hover:bg-dark-400/70"
                }`}
              >
                7m
              </button>
            </div>
          </div>
          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, i) => i}
            tableClassName="trades-table"
          />
        </div>
      )}
    </>
  );
};

export default RecentTradesSection;
