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
  liveInterval,
  liveOhlcv,
  mode = "historical",
  setLiveInterval,
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

  const prevOhlcDataLength = useRef<number>(data?.length || 0);

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
      console.log(entries);
      if (!entries.length) return;
      chart.applyOptions({
        width: entries[0].contentRect.width,
        // height: entries[0].contentRect.height,
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

  /* -------------------- Effect #2: update data only -------------------- */
  /**
   * This effect:
   * - Runs when data or period changes
   * - Updates ONLY the series data
   * - Does NOT recreate the chart
   *
   * This keeps updates fast and prevents flickering.
   */
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData,
    );

    let merged: OHLCData[];
    if (liveOhlcv) {
      const liveTimeStamp = liveOhlcv[0];
      const lastHistorical = convertedToSeconds[convertedToSeconds.length - 1];

      if ((lastHistorical && lastHistorical[0]) === liveTimeStamp) {
        merged = [...convertedToSeconds, liveOhlcv];
      } else {
        merged = [...convertedToSeconds.slice(0, -1), liveOhlcv];
      }
    } else {
      merged = convertedToSeconds;
    }

    merged.sort((a, b) => a[0] - b[0]); // Ensure data is sorted by timestamp

    const converted = convertOHLCData(merged);

    console.log(merged);

    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();

    const dataChanged = prevOhlcDataLength.current !== ohlcData.length;

    if (dataChanged || mode === "historical") {
      chartRef.current?.timeScale().fitContent();
      prevOhlcDataLength.current = ohlcData.length;
    }
  }, [ohlcData, period, liveOhlcv, mode]);

  /* -------------------- Render -------------------- */

  return (
    <div id="candlestick-chart" className="flex flex-col h-full">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="flex gap-3 items-center">
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

        {liveInterval && (
          <div className="button-group">
            <span className="text-sm mx-2 font-medium text-purple-100/50">
              Update Frequency:
            </span>
            {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={
                  liveInterval === value
                    ? "config-button-active"
                    : "config-button"
                }
                onClick={() => setLiveInterval && setLiveInterval(value)}
                disabled={isPending}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart container (controlled only via ref) */}
      <div
        ref={chartContainerRef}
        className="chart flex-1 "
        //  style={{ height }}
      />
    </div>
  );
};

export default CandlestickChart;
