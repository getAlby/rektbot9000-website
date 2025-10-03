"use client";

import * as asciichart from "asciichart";
import { useMemo } from "react";
import { BalancePoint, MAX_BALANCE_POINTS } from "@/lib/utils";

type Props = {
  data: BalancePoint[];
};

export default function BalanceChart({ data }: Props) {
  const chart = useMemo(() => {
    if (!data.length) {
      return "(no balance data yet)";
    }

    // Take the last MAX_BALANCE_POINTS balances in chronological order
    const series = data
      .slice(-MAX_BALANCE_POINTS)
      .map((point) => point.balance);

    console.log("📊 Chart data points:", series.length, "Latest:", series[series.length - 1]);

    // Ensure we have at least 2 data points for asciichart
    const padded = series.length < 2 ? [...series, series[0]] : series;

    const minValue = Math.min(...padded);
    const maxValue = Math.max(...padded);
    const span = Math.max(1, maxValue - minValue);
    const padding = Math.max(1, Math.round(span * 0.05));

    // Fixed width label gutter so graph aligns regardless of label length
    const labelWidth = 7; // space for 5-6 digit sats

    const output = asciichart.plot(padded, {
      height: 10,
      // Do NOT use colors in browsers (ANSI codes would render literally)
      min: minValue - padding,
      max: maxValue + padding,
      format: (value: number) =>
        Math.round(value)
          .toLocaleString()
          .padStart(labelWidth, " "),
    });

    return output;
  }, [data]);

  return (
    <div className="balance-chart-container rounded-2xl border border-[#ff71cd26] bg-[#160613]/70 px-6 py-5 text-[#e8c9dd]">
      <div className="balance-chart-title mb-3 text-sm uppercase tracking-[0.2em] text-[#e8c9dd]/70">
        $ render ./wallet_balance --tail {MAX_BALANCE_POINTS}
      </div>
      <pre className="whitespace-pre leading-tight text-[#e8c9dd] overflow-x-auto">{chart}</pre>
    </div>
  );
}

