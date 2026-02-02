import DataTable from "@/components/DataTable";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { trendingCoinsData } from "@/app/data/trendingCoins";
import { fetcher } from "@/lib/coingecko.actions";
import CoinOverview from "@/components/CoinOverview";
import TrendingCoins from "@/components/TrendingCoins";

const Home = async () => {
  const coin = await fetcher<CoinDetailsData>("/coins/bitcoin", {
    dex_pair_format: "symbol",
  });

  return (
    <main className="main-container">
      <section className="home-grid">
        <CoinOverview />

        <TrendingCoins />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Home;
