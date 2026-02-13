"use client";

import {
  getCandlestickConfig,
  getChartConfig,
  LIVE_INTERVAL_BUTTONS,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from "@/constants";
import { fetcher } from "@/lib/coingecko.actions";
import { convertOHLCData } from "@/lib/utils";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState, useTransition } from "react";

const CandlestickChart = ({
  children,
  initialPeriod = "daily",
  coinId,
  data,
  height = null,
}: CandlestickChartProps) => {
  /* -------------------- React state -------------------- */

  // Currently selected time period (daily, weekly, ...)
  const [period, setPeriod] = useState(initialPeriod);

  // Raw OHLC data coming from API
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);

  // Used to avoid blocking UI when switching periods
  const [isPending, startTransition] = useTransition();

  /* -------------------- Refs (imperative objects) -------------------- */

  // DOM container for the chart
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // Chart instance (created once, reused)
  const chartRef = useRef<IChartApi | null>(null);

  // Candlestick series instance (used to update data only)
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);


  /* -------------------- Data fetching -------------------- */

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days,
        precision: "full",
      });

      // Update state in a transition to keep UI responsive
      startTransition(() => {
        setOhlcData(newData ?? []);
      });
    } catch (e) {
      console.error("Failed to fetch OHLC data", e);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    setPeriod(newPeriod);
    fetchOHLCData(newPeriod);
  };

  /* -------------------- Effect #1: create & destroy chart -------------------- */
  /**
   * This effect is responsible for:
   * - Creating the chart instance
   * - Adding the candlestick series
   * - Handling resize behavior
   * - Cleaning everything up on unmount
   *
   * It should NOT run on every data change.
   */
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Show date or time based on selected period
    const showTime = ["daily", "weekly", "monthly"].includes(period);

    // Create the chart (imperative API)

    const chart = createChart(container, {
      ...getChartConfig(height ?? container.clientHeight, showTime),
      width: container.clientWidth,
    });

    // Add candlestick series once
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    // Save references for later updates
    chartRef.current = chart;
    candleSeriesRef.current = series;

    // Initial data setup
    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000), // ms → seconds (required by lightweight-charts)
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData,
    );

    series.setData(convertOHLCData(convertedToSeconds));
    chart.timeScale().fitContent();

    // ResizeObserver keeps the chart responsive
    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({
        width: entries[0].contentRect.width,
      });
    });

    observer.observe(container);

    // Cleanup: remove chart and observers
    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [period]);

  /* -------------------- Render -------------------- */

  return (
    <div id="candlestick-chart" className="flex flex-col h-full">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-purple-100/50">
            Period:
          </span>

          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              disabled={isPending}
              onClick={() => handlePeriodChange(value)}
              className={
                period === value ? "config-button-active" : "config-button"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container (controlled only via ref) */}
      <div ref={chartContainerRef} className="chart flex-1 " />
    </div>
  );
};

export default CandlestickChart;
