import { type ClassValue, clsx } from "clsx";
import { nip19 } from "nostr-tools";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BOT_PUBKEY =
  "npub1r3ktgeesy2v7pckprwp4ye2zhca6f0jqkqgre5d9pp0c8z2le33q65dae4";

// Convert npub to hex format for nostr-tools
export function npubToHex(npub: string): string {
  try {
    // If already hex, return as-is
    if (/^[0-9a-fA-F]{64}$/.test(npub)) return npub.toLowerCase();
    // Decode bech32 npub using nostr-tools nip19 (works in browser)
    const decoded = nip19.decode(npub);
    const data = decoded?.data as string | Uint8Array;
    if (typeof data === "string") return data.toLowerCase();
    // Convert bytes to hex
    return Array.from(data)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Error converting npub to hex:", error);
    return npub;
  }
}

export const BOT_PUBKEY_HEX = npubToHex(BOT_PUBKEY);

export const MAX_BALANCE_POINTS = 64;

// Test the parsing functions with sample data
export function testParsing() {
  const testBalance = "My balance is 14236 sats";
  const testTrade = `TRADE CLOSED!!!
Entry Price: 120,468
Exit Price: 120,300.5
Profit/Loss: -2 sats 😭
Quantity: 1 USD
Liquidation: 109,517.5
Side: Buy
Leverage: 10x`;

  console.log("🧪 Testing balance parsing:", parseBalanceContent(testBalance));
  console.log("🧪 Testing trade parsing:", parseTradeContent(testTrade));
}

export const DEFAULT_RELAYS = [
  "wss://relay.snort.social",
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
  "wss://relay.nostr.bg",
];

export type TradeType = "BUY" | "SELL";

export interface BalancePoint {
  timestamp: number;
  balance: number;
}

export interface TradePoint {
  timestamp: number;
  amount: number;
  type: TradeType;
}

export interface TerminalTrade {
  timestamp: number;
  amount: number;
  type: TradeType;
  balance: number | null;
  entryPrice?: number | null;
  exitPrice?: number | null;
  pnl?: number | null;
  quantityUsd?: number | null;
  liquidation?: number | null;
  leverage?: string | null;
  sideLabel?: string | null;
  raw?: string;
}

export interface ParsedEvents {
  balances: BalancePoint[];
  trades: TradePoint[];
}

export function parseEventContent(content: string) {
  const normalized = content.trim().toUpperCase();
  if (normalized.startsWith("BALANCE:")) {
    const value = Number(normalized.replace("BALANCE:", "").trim());
    if (!Number.isNaN(value)) {
      return { type: "BALANCE" as const, balance: value };
    }
  }

  if (normalized.startsWith("BUY:")) {
    const value = Number(normalized.replace("BUY:", "").trim());
    if (!Number.isNaN(value)) {
      return { type: "BUY" as const, amount: value };
    }
  }

  if (normalized.startsWith("SELL:")) {
    const value = Number(normalized.replace("SELL:", "").trim());
    if (!Number.isNaN(value)) {
      return { type: "SELL" as const, amount: value };
    }
  }

  return null;
}

export function parseBalanceContent(content: string) {
  // Match "My balance is 14236 sats" format
  const match = content.match(/my balance is\s*([\d,\.]+)\s*sats/i);
  if (!match) return null;
  const value = Number(match[1].replace(/[,\.]/g, ""));
  return Number.isNaN(value) ? null : value;
}

export function parseTradeContent(content: string) {
  // Match formats from the screenshot:
  // "Entry Price: 120,468" or "Entry Price: $120,535"
  // "Exit Price: 120,300.5"
  // "Profit/Loss: -2 sats"
  // "Quantity (USD): 1 USD" or "Quantity: 1 USD"
  // "Liquidation: 109,517.5" or "Liquidation: $109,693"
  // "Side: Buy" or "Side: Buy (Long)"
  // "Leverage: 10x"
  
  const entry = matchNumber(content, /entry price[:\s]*\$?([\d,\.]+)/i);
  const exit = matchNumber(content, /exit price[:\s]*\$?([\d,\.]+)/i);
  const pnl = matchNumber(content, /profit\/?loss[:\s]*([\-\d,\.]+)\s*sats?/i);
  const quantity = matchNumber(content, /quantity\s*(?:\(usd\))?[:\s]*([\d,\.]+)\s*usd/i);
  const liquidation = matchNumber(content, /liquidation[:\s]*\$?([\d,\.]+)/i);
  const leverageMatch = content.match(/leverage[:\s]*([\dxX\s]+)/i);
  const sideMatch = content.match(/side[:\s]*([a-z\s\(\)]+)/i);

  // Return null if no meaningful data found
  if (![entry, exit, pnl, quantity, liquidation].some((value) => value !== null)) {
    return null;
  }

  return {
    entryPrice: entry,
    exitPrice: exit,
    pnl,
    quantityUsd: quantity,
    liquidation,
    leverage: leverageMatch?.[1].trim() ?? null,
    side: sideMatch?.[1].trim() ?? null,
  };
}

function matchNumber(content: string, regex: RegExp) {
  const match = content.match(regex);
  if (!match) return null;
  const value = Number(match[1].replace(/[, ]/g, ""));
  return Number.isNaN(value) ? null : value;
}

export function formatSats(value: number) {
  return `${value.toLocaleString()} sats`;
}

export function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString();
}

