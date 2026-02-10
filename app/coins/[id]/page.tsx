// 'use client';

import Converter from "@/components/Converter";
import ExchangeListing from "@/components/ExchangeListing";
import LiveDataWrapper from "@/components/LiveDataWrapper";
import RecentTradesSection from "@/components/RecentTradesSection";
import { fetcher, getPools } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import { link } from "fs";
import { ArrowUpRight } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";

// import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";

const CoinDetails = async ({ params }: NextPageProps) => {
  const { id } = await params;

  try {
    const [coinData, ohlcData] = await Promise.all([
      fetcher<CoinDetailsData>(`/coins/${id}`, {}),
      fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
        vs_currency: "usd",
        days: 1,
        precision: "full",
      }),
    ]);

    const platform = coinData.asset_platform_id
      ? coinData.detail_platforms?.[coinData.asset_platform_id]
      : null;
    const network = platform?.geckoterminal_url.split("/")[3] || null;
    const contractAddress = platform?.contract_address || null;

    const pool = await getPools(id, network, contractAddress);

    // const coinData = await fetcher<CoinDetailsData>(`/coins/${id}`, {});

    // const ohlcData = await fetcher<OHLCData>(`/coins/${id}/ohlc`, {
    //   vs_currency: "usd",
    //   days: 1,
    //   precision: "full",
    // });

    //  useBinanceWebSocket({
    //   coinId: "bitcoin",
    //   poolId: "1",
    //   liveInterval: "1m",
    // });

    const coinDetails = [
      {
        label: "Market Cap",
        value: formatCurrency(coinData.market_data.market_cap.usd),
      },
      {
        label: "Market Cap Rank",
        value: coinData.market_data.market_cap_rank,
      },
      {
        label: "Total Volume",
        value: formatCurrency(coinData.market_data.total_volume.usd),
      },
      {
        label: "Website",
        value: "-",
        link: coinData.links.homepage[0],
        linkText: "Homepage",
      },
      {
        label: "Explorer",
        value: "-",
        link: coinData.links.blockchain_site[0],
        linkText: "Explorer",
      },
      {
        label: "Community",
        value: "-",
        link: coinData.links.subreddit_url,
        linkText: "Community",
      },
    ];

    return (
      <main id="coin-details-page">
        <section className="primary">
          <LiveDataWrapper
            coinId={id}
            symbol={coinData.symbol}
            poolId={pool.id}
            coin={coinData}
            ohlcv={ohlcData}
          />
        </section>

        <section className="secondary">
          <Converter
            symbol={coinData.symbol}
            icon={coinData.image.small}
            priceList={coinData.market_data.current_price}
          />

          <div className="details">
            <h2 className="text-2xl font-bold">Coins Details</h2>
            <ul className="details-grid">
              {coinDetails.map(({ label, value, link, linkText }, index) => {
                return (
                  <li key={index}>
                    <p className="label">{label}</p>

                    {link ? (
                      <div className="link">
                        <Link
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {linkText || value}
                        </Link>
                        <ArrowUpRight size={16} />
                      </div>
                    ) : (
                      <p className="text-base font-medium">{value}</p>
                    )}
                  </li>
                );
              })}
            </ul>

            <p>Top Gainers And Losers</p>
          </div>
        </section>

        <section className="exchange-section">
          <ExchangeListing coinId={id} />
        </section>

        <section className="recent-section">
          <RecentTradesSection symbol={coinData.symbol} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching coin details:", error);
    return (
      <main id="coin-details-page">
        <div className="primary">
          <h1 className="text-3xl font-bold">Error</h1>
          <p>Failed to load coin details. Please try again later.</p>
        </div>
      </main>
    );
  }
};

export default CoinDetails;
