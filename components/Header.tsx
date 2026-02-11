"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchModal } from "./SearchModal";
import { fetcher } from "@/lib/coingecko.actions";
import { useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const data = await fetcher<{ coins: TrendingCoin[] }>(
          "/search/trending",
          undefined,
          300,
        );
        setTrendingCoins(data.coins);
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        setTrendingCoins([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  return (
    <header>
      <div className="main-container inner">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="CoinFlux Logo" width={200} height={60} />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn("nav-link", {
              "is-active": pathname === "/",
              "is-home": true,
            })}
          >
            Home
          </Link>

          <SearchModal initialTrendingCoins={trendingCoins} />

          <Link
            href="/coins"
            className={cn("nav-link", {
              "is-active": pathname === "/coins",
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
