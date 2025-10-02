"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useNostrContext } from "@/components/nostr-provider";

const BalanceChart = dynamic(() => import("@/components/charts/balance-chart"), {
  ssr: false,
});

const TradesChart = dynamic(() => import("@/components/charts/trades-chart"), {
  ssr: false,
});

type Props = {
  variant: "balance" | "trades";
};

export function Overview({ variant }: Props) {
  const { balances, trades, isConnected } = useNostrContext();

  return useMemo(() => {
    if (variant === "balance") {
      return <BalanceChart data={balances} ready={isConnected} />;
    }

    return <TradesChart data={trades} ready={isConnected} />;
  }, [variant, balances, trades, isConnected]);
}

