"use client";

import { TradeLog } from "@/components/trade-log";
import { useNostrContext } from "@/components/nostr-provider";

export default function TradesPage() {
  const { terminalTrades } = useNostrContext();

  return (
    <div className="space-y-6">
      <div className="text-accent/80">$ ./trades --follow</div>
      <TradeLog trades={terminalTrades} />
    </div>
  );
}

