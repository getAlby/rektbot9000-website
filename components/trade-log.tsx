"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TerminalTrade } from "@/lib/utils";

type Props = {
  trades: TerminalTrade[];
};

const formatNumber = (value: number | null | undefined, suffix = "") => {
  if (value === null || value === undefined) return "-";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${formatted}${suffix}`;
};

const formatPnl = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  const prefix = value > 0 ? "+" : value < 0 ? "" : "";
  return `${prefix}${value}${value === 1 || value === -1 ? " sat" : " sats"}`;
};

export function TradeLog({ trades }: Props) {
  const rows = useMemo(() => trades.slice(-10).reverse(), [trades]);

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-[#ff71cd26] bg-[#160613]/70 px-6 py-5 text-[#e8c9dd]">
        <pre className="text-[#e8c9dd]">(waiting for trades)</pre>
        <div className="mt-4 text-xs text-[#e8c9dd]/70">
          {">"} <Link href="/trades" className="underline">view full trade log</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#ff71cd26] bg-[#160613]/70 px-6 py-5 text-[#e8c9dd]">
      <div className="mb-3 text-sm uppercase tracking-[0.2em] text-[#e8c9dd]/70">
        $ tail -n 10 ./trades.log
      </div>
      <div className="space-y-3 text-xs text-[#e8c9dd]/85">
        {rows.map((trade) => {
          const balanceLine = trade.balance !== null ? `balance ${trade.balance.toLocaleString()} sats` : null;
          const directionLabel = (trade.sideLabel ?? trade.type).toUpperCase();
          const directionClass = directionLabel.includes("SHORT") || trade.type === "SELL" ? "text-[#ff6969]" : "text-[#7dff9f]";
          return (
            <div key={`${trade.timestamp}-${trade.amount}`}>
              <div className="flex gap-3 text-[#e8c9dd]/60">
                <span className="w-20">
                  {new Date(trade.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className={directionClass}>{trade.sideLabel ?? trade.type}</span>
                <span>{formatNumber(trade.quantityUsd, " USD")}</span>
              </div>
              <div className="ml-20">
                entry: {formatNumber(trade.entryPrice, " USD")} | exit: {formatNumber(trade.exitPrice, " USD")} | pnl: {formatPnl(trade.pnl)}
              </div>
              <div className="ml-20 text-[#e8c9dd]/60">
                liquidation {formatNumber(trade.liquidation, " USD")} | leverage {trade.leverage ?? "-"}
                {balanceLine ? ` | ${balanceLine}` : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-[#e8c9dd]/70">
        {">"} <Link href="/trades" className="underline">view full trade log</Link>
      </div>
    </div>
  );
}

