"use client";

import { useNostrContext } from "@/components/nostr-provider";
import { cn, formatSats, formatTimestamp } from "@/lib/utils";

export function TradesTable() {
  const { trades } = useNostrContext();

  if (trades.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-rekt-purple bg-white/70 p-8 text-center text-sm text-slate-600">
        Waiting for Rektbot 9000 to make a move…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border-4 border-rekt-green/40 shadow-lg shadow-rekt-pink/20">
      <table className="min-w-full divide-y divide-rekt-purple/20 text-left text-sm">
        <thead className="bg-rekt-purple/10 uppercase tracking-wider text-rekt-purple">
          <tr>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white/80">
          {[...trades].reverse().map((trade, index) => (
            <tr
              key={`${trade.timestamp}-${index}`}
              className="border-t border-rekt-purple/10 odd:bg-rekt-green/10 even:bg-white/90"
            >
              <td className="px-4 py-3 text-slate-700">{formatTimestamp(trade.timestamp)}</td>
              <td
                className={cn(
                  "px-4 py-3 font-semibold",
                  trade.type === "BUY" ? "text-emerald-600" : "text-red-500"
                )}
              >
                {trade.type}
              </td>
              <td className="px-4 py-3 text-slate-700">{formatSats(trade.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

