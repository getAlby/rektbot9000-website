"use client";

import BalanceChart from "@/components/balance-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { TerminalFooterLinks } from "@/components/dashboard/terminal-footer-links";
import { useNostrContext } from "@/components/nostr-provider";

export default function Page() {
  const { balances, isConnected } = useNostrContext();
  const latestBalance = balances.length ? balances[balances.length - 1].balance : 0;

  return (
    <div className="space-y-10">
      <DashboardHeader balance={latestBalance} />
      <div className="text-sm text-accent/60">
        {isConnected ? "✅ Connected to Nostr relays" : "❌ Connecting to Nostr relays..."}
      </div>
      <section>
        <BalanceChart data={balances} />
      </section>
      <TerminalFooterLinks />
    </div>
  );
}

