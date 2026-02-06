import { clsx, type ClassValue } from "clsx";
import { Time } from "lightweight-charts";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined || isNaN(change)) {
    return "0.0%";
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}
export function formatCurrency(
  value: number | null | undefined,
  digits?: number,
  currency?: string,
  showSymbol?: boolean,
) {
  if (value === null || value === undefined || isNaN(value)) {
    return showSymbol !== false ? "$0.00" : "0.00";
  }

  if (showSymbol === undefined || showSymbol === true) {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
      minimumFractionDigits: digits ?? 2,
      maximumFractionDigits: digits ?? 2,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits ?? 2,
    maximumFractionDigits: digits ?? 2,
  });
}
export function convertOHLCData(data: OHLCData[]) {
  const turnedData = data
    // Step 1: Convert array-based OHLC data into object-based candlestick data
    .map((d) => ({
      // 'time' must be in seconds (not milliseconds) and of type Time
      time: d[0] as Time,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }))
    // Step 2: Remove consecutive entries with the same timestamp
    // lightweight-charts does not allow duplicate time values
    .filter(
      (item, index, arr) => index === 0 || item.time !== arr[index - 1].time,
    );

  return turnedData;
}

export const ELLIPSIS = "ellipsis" as const;
export type PaginationItem = number | typeof ELLIPSIS;

export function buildPagination(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1, // pages before & after current
): PaginationItem[] {
  const pages: PaginationItem[] = [];

  // Always show first page
  pages.push(1);

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  // LEFT ellipsis
  if (leftSibling > 2) {
    pages.push(ELLIPSIS);
  }

  // Middle pages
  for (let page = leftSibling; page <= rightSibling; page++) {
    pages.push(page);
  }

  // RIGHT ellipsis
  if (rightSibling < totalPages - 1) {
    pages.push(ELLIPSIS);
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}
