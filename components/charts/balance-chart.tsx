"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BalancePoint, formatSats, formatTimestamp } from "@/lib/utils";

type Props = {
  data: BalancePoint[];
  ready: boolean;
};

const tooltipFormatter = (value: number) => formatSats(value);
const tooltipLabelFormatter = (label: number) => formatTimestamp(label);

export default function BalanceChart({ data, ready }: Props) {
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff61d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8a5dff" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5 5" stroke="#fca7de" opacity={0.5} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              new Date(value * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            stroke="#8a5dff"
          />
          <YAxis
            tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            stroke="#8a5dff"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 16,
              border: "2px solid #ff61d4",
            }}
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#ff61d4"
            strokeWidth={3}
            fill="url(#colorBalance)"
            isAnimationActive={ready}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

