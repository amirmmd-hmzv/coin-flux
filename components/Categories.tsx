import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "./DataTable";
import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const Categories = async () => {
  const categories = await fetcher<Category[]>("/coins/categories");


  const columns: DataTableColumn<Category>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: (category) => {
        return category.name;
      },
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: (category) => {
        return category.top_3_coins.map((coin) => {
          return (
            <Image src={coin} alt={coin} key={coin} width={28} height={28} />
          );
        });
      },
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: (coin) => {
        const item = coin.market_cap_change_24h;

        const isTrendingUp = item > 0;

        return (
          <div
            className={cn(
              "change-cell",
              isTrendingUp ? "text-green-500" : "text-red-500",
            )}
          >
            <p className="flex items-center">
              {formatPercentage(item)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (category) => {
        return formatCurrency(category.market_cap);
      },
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: (category) => {
        return formatCurrency(category.volume_24h);
      },
    },
  ];

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Categories</h4>

      <DataTable
        tableClassName="mt-5"
        data={categories.slice(0, 10) || []}
        columns={columns}
        rowKey={(_, index) => {
          return `${index}`;
        }}
      />
    </div>
  );
};

export default Categories;
