"use client";

import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import DataTable from "./DataTable";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface RecentTradesSectionProps {
  symbol: string;
}

const RecentTradesSection = ({ symbol }: RecentTradesSectionProps) => {

  const { trades } = useBinanceWebSocket({
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
