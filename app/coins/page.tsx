import CoinsPagination from "@/components/CoinsPagination";
import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export const metadata = {
  title: "All Cryptocurrencies | Live Market Rankings - CoinFlux",
  description:
    "Browse all cryptocurrencies ranked by market cap. View live prices, 24-hour percentage changes, and up-to-date market data for top digital assets.",
};


const Coins = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const per_page = 10;

  const coins = await fetcher<CoinMarketData[]>("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page,
    page: currentPage,
    sparkline: false,
  });

  const hasMorePage = coins.length === per_page;
  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100;

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
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
      cell: (coin) => {
        return (
          <div className="token-info">
            <Image src={coin?.image || "/globe.svg"} alt={coin?.name} width={36} height={36} />
            <p>
              {coin?.name} ({coin?.symbol.toUpperCase()})
            </p>
          </div>
        );
      },
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

        <CoinsPagination
          hasMorePage={hasMorePage}
          totalPages={estimatedTotalPages}
          currentPage={currentPage}
        />
      </div>
    </main>
  );
};

export default Coins;
