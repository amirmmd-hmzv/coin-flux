import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Coins = async () => {
  const coins = await fetcher<CoinMarketData[]>("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 10,
    page: 1,
    sparkline: false,
  });

  console.log(coins);

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "coin-cell",
      cell: (coin) => {
        return (
          <>
            #{coin.market_cap_rank}
            <Link href={`/coins/${coin.id}`} aria-label="View coin" />
          </>
        );
      },
    },
    {
      header: "Token",
      cellClassName: "token-cell",
      cell: (coin) => (
        <div className="token-info">
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => <p>${formatCurrency(coin.current_price)}</p>,
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        return (
          <p
            className={`${isPositive ? "text-green-500" : "text-red-500"} flex items-center `}
          >
            {isPositive && "+"}
            {formatPercentage(coin.price_change_percentage_24h)}
            {isPositive ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
          </p>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          rowKey={(_, index) => `al-${index}`}
          columns={columns}
          data={coins}
        />
      </div>
    </main>
  );
};

export default Coins;
