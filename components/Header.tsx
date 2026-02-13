"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchModal } from "./SearchModal";
import { fetcher } from "@/lib/coingecko.actions";
import { useEffect, useState, useCallback } from "react";
import { Menu, X, Home, Coins } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/coins", label: "All Coins", icon: Coins },
];

const Header = () => {
  const pathname = usePathname();

  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

useEffect(() => {
  const loadTrending = async () => {
    try {
      const data = await fetcher<{ coins: TrendingCoin[] }>(
        "/search/trending",
        undefined,
        300
      );
      setTrendingCoins(data.coins);
    } catch {
      setTrendingCoins([]);
    }
  };

  loadTrending();
}, []);


  // Close mobile on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // ===== Reusable Nav Link Renderer =====
  const renderNavLink = (
    href: string,
    label: string,
    Icon: any,
    mobile = false
  ) => {
    const isActive = pathname === href;

    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "rounded-lg font-semibold flex items-center transition-all duration-200",
          mobile
            ? "px-4 py-3 text-sm gap-3"
            : "px-4 sm:px-5 py-2.5 text-sm sm:text-base gap-2",
          isActive
            ? "text-primary bg-primary/15 border border-primary/40 shadow-lg shadow-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent hover:border-primary/20"
        )}
      >
        <Icon className={mobile ? "w-5 h-5" : "w-4 h-4 sm:w-5 sm:h-5"} />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-background/98 backdrop-blur-md border-b border-primary/20 shadow-lg shadow-primary/5">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
          <Image
            src="/logo.svg"
            alt="CoinFlux Logo"
            width={140}
            height={40}
            className="w-auto h-8  sm:h-12"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-3">
          {NAV_ITEMS.map((item) =>
            renderNavLink(item.href, item.label, item.icon)
          )}

          <SearchModal initialTrendingCoins={trendingCoins} />
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <SearchModal initialTrendingCoins={trendingCoins} />

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-200 border",
              isMobileMenuOpen
                ? "bg-primary/15 text-primary border-primary/40 shadow-lg shadow-primary/10"
                : "bg-muted/30 text-foreground border-muted/30 hover:bg-primary/5 hover:border-primary/20 hover:text-primary"
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-primary/20 bg-card/80 backdrop-blur-md">
          <nav className="px-4 py-4 space-y-2 flex flex-col">
            {NAV_ITEMS.map((item) =>
              renderNavLink(item.href, item.label, item.icon, true)
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
