"use client";

import { useEffect, useRef, useState } from "react";

type TradeU = {
  price: number;
  amount: number;
  value: number;
  timestamp: number;
  type: "b" | "s";
};

type Candle = [number, number, number, number, number];

export const useBinanceWebSocket = ({
  symbol, // BTCUSDT
  interval, // 1m, 5m, 15m
}: {
  symbol: string;
  interval: string;
}) => {
  const wsRef = useRef<WebSocket | null>(null);

  const [price, setPrice] = useState<NormalizedPrice | null>(null);
  const [trades, setTrades] = useState<TradeU[]>([]);
  const [ohlcvData, setOhlcvData] = useState<Candle | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    const streams = [
      `${symbol.toLowerCase()}@ticker`,
      `${symbol.toLowerCase()}@trade`,
      `${symbol.toLowerCase()}@kline_${interval}`,
    ].join("/");

    const ws = new WebSocket(
      `wss://fstream.binance.com/stream?streams=${streams}`,
    );

    wsRef.current = ws;

    ws.onopen = () => {
      setIsWsReady(true);
      console.log("Binance WS connected");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const data = msg.data;

      if (!data) return;

      // 💰 Price
      if (data.e === "markPriceUpdate") {
        setPrice({
          usd: Number(data.p),
          change24h: Number(data.r), // percent change 24h
          change24hValue: Number(data.p),
        });
      }

      if (data.e === "24hrTicker") {
        setPrice({
          usd: Number(data.c), // آخرین قیمت
          change24h: Number(data.P), // درصد تغییر 24h
          change24hValue: Number(data.p), // مقدار تغییر 24h
        });
      }

      // 🔁 Trades
      if (data.e === "trade") {
        const trade: TradeU = {
          price: Number(data.p),
          amount: Number(data.q), // 👈 amount
          value: Number(data.p) * Number(data.q), // 👈 value
          timestamp: data.T,
          type: data.m ? "s" : "b", // 👈 sell / buy
        };

        setTrades((prev) => [trade, ...prev].slice(0, 7));
      }

      // 📊 OHLCV
      if (data.e === "kline") {
        const k = data.k;

        const candle: Candle = [
          k.t,
          Number(k.o),
          Number(k.h),
          Number(k.l),
          Number(k.c),
        ];

        setOhlcvData(candle);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
    };

    ws.onclose = () => {
      setIsWsReady(false);
      console.log("WS closed");
    };

    return () => {
      ws.close();
    };
  }, [symbol, interval]);

  return {
    price,
    trades,
    ohlcvData,
    isWsReady,
  };
};
