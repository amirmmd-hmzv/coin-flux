import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "./ui/badge";

/**
 * CoinHeader Component
 * Displays live cryptocurrency price and performance statistics
 */
const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) => {
  /* ==================== State & Calculations ==================== */

  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  /* ==================== Data & Constants ==================== */

  const stats: Array<{
    label: string;
    value: number;
    isUp: boolean;
    formatter: (value: number) => string;
    showIcon: boolean;
  }> = [
    {
      label: "Today",
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "30 Days",
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "Price Change (24h)",
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  /* ==================== Render Functions ==================== */

  /**
   * Renders the trending icon based on direction
   */
  const TrendIcon = ({ isUp }: { isUp: boolean }) =>
    isUp ? (
      <TrendingUp width={16} height={16} />
    ) : (
      <TrendingDown width={16} height={16} />
    );

  /**
   * Renders the price badge with change percentage and icon
   */
  const PriceBadge = () => (
    <Badge className={cn("badge", isTrendingUp ? "badge-up" : "badge-down")}>
      {formatPercentage(livePriceChangePercentage24h)}
      <TrendIcon isUp={isTrendingUp} />
      <span>(24h)</span>
    </Badge>
  );

  /**
   * Renders individual stat item
   */
  const StatItem = ({
    label,
    value,
    isUp,
    formatter,
    showIcon,
  }: (typeof stats)[0]) => (
    <li key={label}>
      <p className="label">{label}</p>
      <div
        className={cn("value", {
          "text-green-500": isUp,
          "text-red-500": !isUp,
        })}
      >
        <p>{formatter(value)}</p>
        {showIcon && <TrendIcon isUp={isUp} />}
      </div>
    </li>
  );

  /* ==================== Render ==================== */

  return (
    <div id="coin-header">
      {/* Header Title */}
      <h3 className="mb-6 text-2xl font-semibold">{name}</h3>

      {/* Price Section with Image */}
      <div className="info">
        <Image
          src={image}
          alt={`${name} logo`}
          width={77}
          height={77}
          priority
          className="rounded-full"
        />

        <div className="price-row">
          <h1 className="text-4xl font-bold md:text-5xl">
            {formatCurrency(livePrice)}
          </h1>
          <PriceBadge />
        </div>
      </div>

      {/* Statistics Grid */}
      <ul className="stats">
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </ul>
    </div>
  );
};

export default CoinHeader;
