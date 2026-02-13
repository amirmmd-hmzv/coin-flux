"use client";

import { useEffect, useRef, useState } from "react";

const WS_BASE_URL = process.env.NEXT_PUBLIC_BINANCE_WS_URL;

export const useBinanceWebSocket = ({ symbol }: { symbol: string }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [price, setPrice] = useState<NormalizedPrice | null>(null);
  const [trades, setTrades] = useState<TradeU[]>([]);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    if (!symbol || !WS_BASE_URL) return;

    let isMounted = true;

    const streams = [
      `${symbol.toLowerCase()}@ticker`,
      `${symbol.toLowerCase()}@trade`,
    ].join("/");

    const connect = () => {
      const ws = new WebSocket(`${WS_BASE_URL}?streams=${streams}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setIsWsReady(true);
        console.log("Binance WS connected");
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;

        let parsed;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          return;
        }

        const data = parsed?.data;
        if (!data) return;

        // 24h Ticker
        if (data.e === "24hrTicker") {
          setPrice({
            usd: Number(data.c),
            change24h: Number(data.P),
            change24hValue: Number(data.p),
          });
        }

        // Trades
        if (data.e === "trade") {
          const trade: TradeU = {
            price: Number(data.p),
            amount: Number(data.q),
            value: Number(data.p) * Number(data.q),
            timestamp: data.T,
            type: data.m ? "s" : "b",
          };

          setTrades((prev) => {
            const updated = [trade, ...prev];
            return updated.length > 7 ? updated.slice(0, 7) : updated;
          });
        }
      };

      ws.onerror = () => {
        if (!isMounted) return;
        setIsWsReady(false);
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setIsWsReady(false);
        console.log("WS closed");

        // 🔁 auto reconnect (after 2s)
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000);
      };
    };

    connect();

    return () => {
      isMounted = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      wsRef.current?.close();
    };
  }, [symbol]);

  return {
    price,
    trades,
    isWsReady,
  };
};
