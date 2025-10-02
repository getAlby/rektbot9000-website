"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TradePoint, formatSats, formatTimestamp } from "@/lib/utils";

type Props = {
  data: TradePoint[];
  ready: boolean;
};

export default function TradesChart({ data, ready }: Props) {
  const merged = data.map((item) => ({
    timestamp: item.timestamp,
    buy: item.type === "BUY" ? item.amount : 0,
    sell: item.type === "SELL" ? item.amount : 0,
  }));

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={merged} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#76f7a5" opacity={0.6} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              new Date(value * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            stroke="#ff61d4"
          />
          <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} stroke="#ff61d4" />
          <Tooltip
            formatter={(value: number) => formatSats(value)}
            labelFormatter={(label) => formatTimestamp(Number(label))}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 16,
              border: "2px solid #76f7a5",
            }}
          />
          <Legend
            wrapperStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "8px 12px",
              borderRadius: "12px",
            }}
          />
          <Bar dataKey="buy" fill="#76f7a5" name="Buys" isAnimationActive={ready} />
          <Bar dataKey="sell" fill="#ff784d" name="Sells" isAnimationActive={ready} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

