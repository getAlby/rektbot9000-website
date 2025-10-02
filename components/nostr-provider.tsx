"use client";

import { createContext, useContext, useMemo } from "react";
import { useNostrStream } from "@/hooks/use-nostr-stream";
import type { BalancePoint, TradePoint, TerminalTrade } from "@/lib/utils";

type NostrContextValue = {
  balances: BalancePoint[];
  trades: TradePoint[];
  terminalTrades: TerminalTrade[];
  isConnected: boolean;
};

const NostrContext = createContext<NostrContextValue | undefined>(undefined);

export function NostrProvider({ children }: { children: React.ReactNode }) {
  const { balances, trades, terminalTrades, isConnected } = useNostrStream();

  const value = useMemo(
    () => ({ balances, trades, terminalTrades, isConnected }),
    [balances, trades, terminalTrades, isConnected]
  );

  return <NostrContext.Provider value={value}>{children}</NostrContext.Provider>;
}

export function useNostrContext() {
  const context = useContext(NostrContext);
  if (!context) {
    throw new Error("useNostrContext must be used within a NostrProvider");
  }
  return context;
}

