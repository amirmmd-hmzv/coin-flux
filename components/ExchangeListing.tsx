import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "./DataTable";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface ExchangeListingProps {
  coinId: string;
}

const ExchangeListing = async ({ coinId }: ExchangeListingProps) => {
  try {
    const response = await fetcher<{
      tickers: Array<{
        base: string;
        target: string;
        market: {
          name: string;
          identifier: string;
          logo: string;
        };
        last: number;
        volume: number;
        trust_score: string;
        trade_url: string;
        last_traded_at: string;
      }>;
    }>(`/coins/${coinId}/tickers`, {
      include_exchange_logo: true,
      order: "trust_score_desc",
      limit: 100,
    });

    // Extract tickers array from response
    const tickers = response.tickers || [];

    // Map tickers to exchange format
    const exchangeList = tickers.map((ticker: any) => ({
      id: ticker.market?.identifier || ticker.market?.name || "",
      name: ticker.market?.name || "Unknown",
      image: ticker.market?.logo || "",
      pair: ticker.base + "/" + ticker.target,
      price: ticker.last || 0,
      volume: ticker.volume || 0,
      lastTradedAt: ticker.last_traded_at || "",
      url: ticker.trade_url || "",
    }));

    const columns: DataTableColumn<any>[] = [
      {
        header: "Exchange",
        cell: (row) => (
          <div className="exchange-name flex items-center gap-3">
            {row.image && (
              <Image
                src={row.image}
                alt={row.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <p  className="font-medium">
              {row.name}
            </p>
          </div>
        ),
        headClassName: "w-1/4",
        cellClassName: "w-1/4",
      },
      {
        header: "Pair",
        cell: (row) => (
          <div className="pair">
            <p>{row.pair}</p>
          </div>
        ),
        headClassName: "w-1/5",
        cellClassName: "price-cell",
      },
      {
        header: "Price",
        cell: (row) => (
          <span className="price-cell font-medium">
            {row.price ? formatCurrency(row.price, 2, "usd", false) : "N/A"}
          </span>
        ),
        headClassName: "w-1/5",
        cellClassName: "price-cell",
      },
      {
        header: "Last Traded",
        cell: (row) => {
          const date = row.lastTradedAt ? new Date(row.lastTradedAt) : null;
          const now = new Date();
          let relativeTime = "N/A";

          if (date) {
            const diffInSeconds = Math.floor(
              (now.getTime() - date.getTime()) / 1000,
            );
            if (diffInSeconds < 60) {
              relativeTime = `${diffInSeconds} sec ago`;
            } else if (diffInSeconds < 3600) {
              const minutes = Math.floor(diffInSeconds / 60);
              relativeTime = `${minutes} min ago`;
            } else if (diffInSeconds < 86400) {
              const hours = Math.floor(diffInSeconds / 3600);
              relativeTime = `${hours} hr${hours > 1 ? "s" : ""} ago`;
            } else {
              const days = Math.floor(diffInSeconds / 86400);
              relativeTime = `${days} day${days > 1 ? "s" : ""} ago`;
            }
          }

          return (
            <div className="  ">
              {row.url ? (
                <Link
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span className="text-sm">{relativeTime}</span>
                  <ArrowUpRight size={14} />
                </Link>
              ) : (
                <span className="text-purple-100 text-sm">{relativeTime}</span>
              )}
            </div>
          );
        },
        headClassName: "w-1/5 text-left",
        cellClassName: "time-cell",
      },
    
    ];

    return (
      <div className="w-full">
        <h4>Exchange Listing</h4>
        <div >
          <DataTable
            columns={columns}
            data={exchangeList.slice(0, 7)}
            rowKey={(row) => row.id + row.pair}
            tableClassName="exchange-table"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching exchange listing:", error);
    return (
      <div id="exchange-listing">
        <div className="exchange-section">
          <h4>Exchange Listing</h4>
          <div className="exchange-table">
            <div className="p-4 bg-dark-400/50 rounded-lg border border-purple-600/20">
              <p className="text-purple-100">
                Failed to load exchange listings
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ExchangeListing;
