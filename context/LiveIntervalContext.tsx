"use client";

import React, { createContext, useContext, useState } from "react";

interface LiveIntervalContextType {
  liveInterval: "1m" | "7m";
  setLiveInterval: (interval: "1m" | "7m") => void;
}

const LiveIntervalContext = createContext<LiveIntervalContextType | undefined>(
  undefined,
);

export const LiveIntervalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [liveInterval, setLiveInterval] = useState<"1m" | "7m">("1m");

  return (
    <LiveIntervalContext.Provider value={{ liveInterval, setLiveInterval }}>
      {children}
    </LiveIntervalContext.Provider>
  );
};

export const useLiveInterval = () => {
  const context = useContext(LiveIntervalContext);
  if (context === undefined) {
    throw new Error(
      "useLiveInterval must be used within a LiveIntervalProvider",
    );
  }
  return context;
};
