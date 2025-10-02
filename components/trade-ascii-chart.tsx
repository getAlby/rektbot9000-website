"use client";

import Chartscii from "chartscii";
import { useMemo } from "react";
import { TerminalTrade } from "@/lib/utils";

type Props = {
  trades: TerminalTrade[];
};

const MAX_POINTS = 48;

export function TradeAsciiChart({ trades }: Props) {
  const chart = useMemo(() => {
    if (!trades.length) {
      return "(waiting for trade feed)";
    }

    const latest = trades.slice(-MAX_POINTS);
    const values = latest.map((trade) => trade.pnl ?? trade.amount ?? 0);
    const maxAbs = Math.max(...values.map((value) => Math.abs(value))) || 1;
    const normalised = values.map((value) => value / maxAbs);

    const asciiChart = new Chartscii(normalised, {
      width: Math.min(72, Math.max(32, normalised.length * 2)),
      height: 10,
      labels: false,
      padding: 0,
      orientation: "vertical",
      char: "█",
      fill: " ",
      naked: true,
    });

    return asciiChart.create();
  }, [trades]);

  return (
    <div className="rounded-2xl border border-[#ff71cd26] bg-[#160613]/70 px-6 py-5">
      <div className="mb-3 text-sm uppercase tracking-[0.2em] text-accent/60">
        $ render ./pnl_ascii --tail {MAX_POINTS}
      </div>
      <pre className="whitespace-pre leading-tight text-accent">{chart}</pre>
    </div>
  );
}
