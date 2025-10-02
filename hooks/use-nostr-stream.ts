"use client";

import { useEffect, useMemo, useState } from "react";
import { SimplePool, type Event } from "nostr-tools";
import {
  BOT_PUBKEY,
  BOT_PUBKEY_HEX,
  DEFAULT_RELAYS,
  type BalancePoint,
  type TradePoint,
  type TerminalTrade,
  parseBalanceContent,
  parseTradeContent,
  testParsing,
  MAX_BALANCE_POINTS,
} from "@/lib/utils";

const TRADE_CACHE_LIMIT = 400;
const BALANCE_CACHE_LIMIT = 240;

const TRADE_OPEN_KEYWORDS = ["new trade", "trade open", "just went long", "opening trade", "entry price"];
const TRADE_CLOSE_KEYWORDS = ["trade closed", "closing trade", "exit price", "closed position"];

type State = {
  balances: BalancePoint[];
  trades: TradePoint[];
  terminalTrades: TerminalTrade[];
  isConnected: boolean;
};

const initialState: State = {
  balances: [],
  trades: [],
  terminalTrades: [],
  isConnected: false,
};

function classifyTrade(content: string) {
  const lower = content.toLowerCase();
  if (TRADE_CLOSE_KEYWORDS.some((keyword) => lower.includes(keyword))) return "close" as const;
  if (TRADE_OPEN_KEYWORDS.some((keyword) => lower.includes(keyword))) return "open" as const;
  return null;
}

function computeTradeAmount(parsed: ReturnType<typeof parseTradeContent>, tradeType: "open" | "close") {
  if (!parsed) return 0;
  if (parsed.pnl !== null && tradeType === "close") {
    return parsed.pnl;
  }
  if (parsed.quantityUsd !== null) {
    return parsed.quantityUsd;
  }
  return parsed.entryPrice ?? 0;
}

export function useNostrStream() {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    console.log("🔌 Connecting to Nostr relays:", DEFAULT_RELAYS);
    console.log("🤖 Bot pubkey:", BOT_PUBKEY);
    
    // Test parsing functions
    testParsing();
    
    let pool: SimplePool | null = null;
    let sub: any = null;
    let connectionTimeout: NodeJS.Timeout | null = null;

    const connectToRelays = async () => {
      try {
        pool = new SimplePool();
        
        // Set a timeout to mark as connected if we don't get events
        connectionTimeout = setTimeout(() => {
          console.log("⏰ Connection timeout - marking as connected");
          setState((prev) => ({ ...prev, isConnected: true }));
        }, 5000);

        // Fetch historical balances (up to MAX_BALANCE_POINTS)
        try {
          // Simple historical load: open a short-lived subscription to fetch recent notes
          const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7; // last week fallback
          const historySub = pool.subscribe(
            DEFAULT_RELAYS,
            { kinds: [1], authors: [BOT_PUBKEY_HEX], since },
            {
              onevent: (event: Event) => {
                const balance = parseBalanceContent(event.content);
                if (balance !== null) {
                  setState((prev) => {
                    const next = [
                      ...prev.balances,
                      { timestamp: event.created_at ?? 0, balance },
                    ]
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .slice(-MAX_BALANCE_POINTS);
                    return { ...prev, balances: next };
                  });
                }
              },
              oneose: () => {
                historySub.close("history loaded");
              },
            }
          );
        } catch (e) {
          console.warn("⚠️ Historical fetch failed:", e);
        }

        // Live subscription
        console.log("🔍 Subscribing for live events (hex pubkey)...");
        sub = pool.subscribe(DEFAULT_RELAYS, { kinds: [1], authors: [BOT_PUBKEY_HEX] }, {
          onevent: (event: Event) => {
            console.log("📨 Nostr event received:", event);
            
            const content = event.content;
            const timestamp = event.created_at ?? Math.floor(Date.now() / 1000);
            const balanceValue = parseBalanceContent(content);
            const tradeDetails = parseTradeContent(content);

            console.log("🔍 Parsed data:", { content, balanceValue, tradeDetails });
            
            // Clear timeout and mark as connected
            if (connectionTimeout) {
              clearTimeout(connectionTimeout);
              connectionTimeout = null;
            }
            setState((prev) => ({ ...prev, isConnected: true }));

            if (balanceValue !== null) {
              console.log("💰 Balance update:", balanceValue);
              setState((prev) => {
                const nextBalances = [
                  ...prev.balances,
                  {
                    timestamp,
                    balance: balanceValue,
                  },
                ]
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .slice(-MAX_BALANCE_POINTS);

                const nextTerminal = prev.terminalTrades.length
                  ? prev.terminalTrades.map((trade, index) =>
                      index === prev.terminalTrades.length - 1 && trade.balance === null
                        ? { ...trade, balance: balanceValue }
                        : trade
                    )
                  : prev.terminalTrades;

                return {
                  ...prev,
                  balances: nextBalances,
                  terminalTrades: nextTerminal,
                };
              });
              return;
            }

            if (tradeDetails) {
              console.log("📈 Trade update:", tradeDetails);
              const classification = classifyTrade(content) ?? "open";
              const amount = computeTradeAmount(tradeDetails, classification);
              const chartAmount = Math.abs(amount);
              const tradePoint: TradePoint = {
                timestamp,
                amount: chartAmount,
                type: classification === "close" && tradeDetails.pnl !== null && tradeDetails.pnl < 0 ? "SELL" : "BUY",
              };

              const terminalTrade: TerminalTrade = {
                timestamp: timestamp * 1000,
                amount: classification === "close" ? tradeDetails.pnl ?? amount : amount,
                type: tradePoint.type,
                balance: classification === "close" ? null : state.balances[state.balances.length - 1]?.balance ?? null,
                entryPrice: tradeDetails.entryPrice,
                exitPrice: tradeDetails.exitPrice,
                pnl: tradeDetails.pnl,
                quantityUsd: tradeDetails.quantityUsd,
                liquidation: tradeDetails.liquidation,
                leverage: tradeDetails.leverage,
                sideLabel: tradeDetails.side,
                raw: content,
              };

              setState((prev) => {
                const nextTrades = [...prev.trades, tradePoint].slice(-TRADE_CACHE_LIMIT);
                const nextTerminalTrades = [...prev.terminalTrades, terminalTrade].slice(-TRADE_CACHE_LIMIT);
                return {
                  ...prev,
                  trades: nextTrades,
                  terminalTrades: nextTerminalTrades,
                };
              });
            }
          },
          oneose: () => {
            console.log("✅ End of stored events");
          },
        });

        console.log("🚀 Subscription created successfully");
        
      } catch (error) {
        console.error("❌ Error connecting to relays:", error);
        setState((prev) => ({ ...prev, isConnected: false }));
      }
    };

    connectToRelays();

    return () => {
      console.log("🧹 Cleaning up Nostr connection");
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      if (sub) {
        sub.close("component unmounted");
      }
      if (pool) {
        pool.close(DEFAULT_RELAYS);
      }
    };
  }, []); // Remove state.balances dependency to prevent reconnections

  return useMemo(() => state, [state]);
}

