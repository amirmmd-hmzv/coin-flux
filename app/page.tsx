import Categories from "@/components/Categories";
import CoinOverview from "@/components/CoinOverview";
import TrendingCoins from "@/components/TrendingCoins";
import { CoinOverviewSkeleton } from "@/components/skeletons/CoinOverviewSkeleton";
import { TrendingCoinsSkeleton } from "@/components/skeletons/TrendingCoinsSkeleton";
import { CategoriesSkeleton } from "@/components/skeletons/CategoriesSkeleton";
import { Suspense } from "react";

const Home = async () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewSkeleton />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsSkeleton />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Home;
