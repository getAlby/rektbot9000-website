"use client";

import BalanceChart from "@/components/balance-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { TerminalFooterLinks } from "@/components/dashboard/terminal-footer-links";
import { useNostrContext } from "@/components/nostr-provider";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
  const { balances, isConnected, terminalTrades } = useNostrContext();
  const latestBalance = balances.length ? balances[balances.length - 1].balance : 0;
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [printedTrades, setPrintedTrades] = useState(false);
  const [printedTip, setPrintedTip] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const printLinesSlowly = useCallback((lines: string[], step = 100) => {
    let delay = 0;
    lines.forEach((line) => {
      delay += step;
      const timeout = setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, delay);
      timeoutsRef.current.push(timeout);
    });
  }, []);

  const handleShowTrades = useCallback(() => {
    if (printedTrades) return;
    setPrintedTrades(true);
    const lines: string[] = [
      "> ./trades.sh",
      "(printing full trade log)",
      "----------------------------------------",
    ];

    if (!terminalTrades.length) {
      lines.push("(no trades yet)");
    } else {
      terminalTrades
        .slice()
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach((trade) => {
          const time = new Date(trade.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          const direction = (trade.sideLabel ?? trade.type).toUpperCase();
          const qty = trade.quantityUsd != null ? `${trade.quantityUsd} USD` : "-";
          const entry = trade.entryPrice != null ? trade.entryPrice.toLocaleString() : "-";
          const exit = trade.exitPrice != null ? trade.exitPrice.toLocaleString() : "-";
          const pnl = trade.pnl != null ? `${trade.pnl} sats` : "-";
          const balance = trade.balance != null ? `${trade.balance.toLocaleString()} sats` : "-";

          lines.push(
            `${time} | ${direction.padEnd(6, " ")} | qty ${qty}`,
          );
          lines.push(
            `  entry ${entry} | exit ${exit} | pnl ${pnl}`,
          );
          lines.push(
            `  balance ${balance} | leverage ${trade.leverage ?? "-"}`,
          );
          lines.push("----------------------------------------");
        });
    }

    printLinesSlowly(lines, 90);
  }, [printedTrades, printLinesSlowly, terminalTrades]);

  const handleShowTip = useCallback(() => {
    if (printedTip) return;
    setPrintedTip(true);
    printLinesSlowly([
      "> sh ./tipREKTBOT9000.sh",
      "(rendering QR)",
      "##########################################################################",
      "##########################################################################",
      "##########################################################################",
      "##########################################################################",
      "########              ##        ##      ##    ######              ########",
      "########  ##########  ##  ####  ######  ##    ######  ##########  ########",
      "########  ##      ##  ####  ######  ######  ##    ##  ##      ##  ########",
      "########  ##      ##  ########    ####        ######  ##      ##  ########",
      "########  ##      ##  ##  ####    ####          ####  ##      ##  ########",
      "########  ##########  ##      ##      ##  ##  ######  ##########  ########",
      "########              ##  ##  ##  ##  ##  ##  ##  ##              ########",
      "########################    ######  ########  ############################",
      "########      ####    ##    ##      ##    ####  ##        ####    ########",
      "########  ####  ########  ######  ######  ##    ####    ####  ##  ########",
      "########  ##########          ##      ##    ##      ####      ##  ########",
      "########    ##      ##  ####      ##      ########      ##  ##    ########",
      "##########  ##  ####          ####    ##  ####  ####    ########  ########",
      "##########          ####  ##  ####    ########  ##      ##  ####  ########",
      "##########  ######      ##      ######  ##        ##    ##    ##  ########",
      "############        ####  ##  ####  ####  ##  ############  ##  ##########",
      "##############  ####  ########      ####  ####  ####  ####  ##  ##########",
      "##########  ####  ##########  ##  ####      ##  ####    ##    ##  ########",
      "########    ######    ##      ##        ##  ##  ##      ##  ####  ########",
      "############        ##    ####    ##      ##########  ##    ##############",
      "########      ##  ##    ##    ####    ##  ######            ##############",
      "########################  ########        ####    ######  ##  ##  ########",
      "########              ########  ######  ####  ##  ##  ##  ##  ##  ########",
      "########  ##########  ##      ####  ##  ########  ######    ##  ##########",
      "########  ##      ##  ####  ##      ##    ####              ##    ########",
      "########  ##      ##  ####  ####  ####        ####  ##        ##  ########",
      "########  ##      ##  ##  ##  ##              ##    ##      ##    ########",
      "########  ##########  ##    ##    ##      ##                ##############",
      "########              ##  ########    ##  ##  ##  ######    ####  ########",
      "##########################################################################",
      "##########################################################################",
      "##########################################################################",
      "##########################################################################",
    ], 110);
  }, [printLinesSlowly, printedTip]);

  return (
    <div className="space-y-10 text-[#e8c9dd]">
      <DashboardHeader balance={latestBalance} />
      <div className="text-sm text-[#e8c9dd]/80 font-mono">
        {isConnected ? "> [ok] connected to nostr relays" : "> [..] connecting to nostr relays"}
      </div>
      <section>
        <BalanceChart data={balances} />
      </section>
      {terminalLines.length ? (
        <section>
          <pre className="whitespace-pre-wrap text-[#e8c9dd]">{terminalLines.join("\n")}</pre>
        </section>
      ) : null}
      <TerminalFooterLinks
        onShowTrades={handleShowTrades}
        onShowTip={handleShowTip}
        tradesVisible={printedTrades}
        tipVisible={printedTip}
      />
    </div>
  );
}

