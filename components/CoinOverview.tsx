import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import CandlestickChart from "./CandlestickChart";

const CoinOverview = async () => {
  // let coin;
  // let coinOHLCData;
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
        precision: "full",
      }),
    ]);

    return (
      <div id="coin-overview">
        <CandlestickChart
          data={coinOHLCData}
          // initialPeriod="daily"
          coinId="bitcoin"
        >
          <div className="header pt-2.5">
            <Image
              width={56}
              height={56}
              alt={coin.name}
              src={coin.image.large}
            />
            <div className="info">
              <p>
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );
  } catch (error) {
    console.error("Error fetching coin overview:", error);
    return <div>Failed to load coin overview</div>;
  }
};

export default CoinOverview;
