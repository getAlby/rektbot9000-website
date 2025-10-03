"use client";

import BalanceChart from "@/components/balance-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { useNostrContext } from "@/components/nostr-provider";
import { useTerminalIntro } from "@/hooks/use-terminal-intro";
import { useCallback, useEffect, useRef, useState } from "react";

type TerminalOutputLine = 
  | { type: "text"; content: string }
  | { type: "trade"; content: string; side?: string }
  | { type: "prompt"; command: string }
  | { type: "status"; content: string }
  | { type: "link"; url: string; label: string };

export default function Page() {
  const { balances, isConnected, terminalTrades } = useNostrContext();
  const latestBalance = balances.length ? balances[balances.length - 1].balance : 0;
  const { introComplete } = useTerminalIntro(latestBalance, isConnected);
  const [terminalLines, setTerminalLines] = useState<TerminalOutputLine[]>([]);
  const [printedProfile, setPrintedProfile] = useState(false);
  const [printedTrades, setPrintedTrades] = useState(false);
  const [printedTip, setPrintedTip] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const printLinesSlowly = useCallback((lines: TerminalOutputLine[], step = 100) => {
    let delay = 0;
    lines.forEach((line) => {
      delay += step;
      const timeout = setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, delay);
      timeoutsRef.current.push(timeout);
    });
  }, []);

  const handleShowProfile = useCallback(() => {
    if (printedProfile) return;
    setPrintedProfile(true);
    
    const lines: TerminalOutputLine[] = [
      { type: "text", content: "" }, // empty line for spacing
      { type: "prompt", command: "./open_nostr_profile.sh" },
      { type: "text", content: "(initializing nostr uplink...)" },
      { type: "text", content: "(connecting relays...)" },
      { type: "status", content: "[ok] uplink established" },
      { type: "text", content: "(opening external profile in browser)" },
      { 
        type: "link", 
        url: "https://primal.net/p/nprofile1qqspcm95vucz9x0qutq3hq6jv4ptuwayheqtqypu6xjsshur390uccsv8camv",
        label: "→ https://primal.net/p/nprofile1qqspcm95vucz9x0qutq3hq6jv4ptuwayheqtqypu6xjsshur390uccsv8camv"
      },
    ];

    printLinesSlowly(lines, 144); // 120 * 1.2 = 144
  }, [printedProfile, printLinesSlowly]);

  const handleShowTrades = useCallback(() => {
    if (printedTrades) return;
    setPrintedTrades(true);
    
    const lines: TerminalOutputLine[] = [
      { type: "text", content: "" }, // empty line for spacing
      { type: "prompt", command: "./tail_trades.sh --tail 16" },
      { type: "text", content: "(printing last 16 trades)" },
      { type: "text", content: "----------------------------------------" },
    ];

    if (!terminalTrades.length) {
      lines.push({ type: "text", content: "(no trades yet)" });
    } else {
      terminalTrades
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp) // Most recent first (descending)
        .slice(0, 16) // Take first 16 (most recent)
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
            { type: "trade", content: `${time} | ${direction.padEnd(6, " ")} | qty ${qty}`, side: direction }
          );
          lines.push(
            { type: "text", content: `  entry ${entry} | exit ${exit} | pnl ${pnl}` }
          );
          lines.push(
            { type: "text", content: `  balance ${balance} | leverage ${trade.leverage ?? "-"}` }
          );
          lines.push({ type: "text", content: "----------------------------------------" });
        });
    }

    printLinesSlowly(lines, 108); // 90 * 1.2 = 108
  }, [printedTrades, printLinesSlowly, terminalTrades]);

  const handleShowTip = useCallback(() => {
    if (printedTip) return;
    setPrintedTip(true);
    
    printLinesSlowly([
      { type: "text", content: "" }, // empty line for spacing
      { type: "prompt", command: "./fund_life.sh" },
      { type: "text", content: "(rendering lightning address QR)" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "########              ##        ##      ##    ######              ########" },
      { type: "text", content: "########  ##########  ##  ####  ######  ##    ######  ##########  ########" },
      { type: "text", content: "########  ##      ##  ####  ######  ######  ##    ##  ##      ##  ########" },
      { type: "text", content: "########  ##      ##  ########    ####        ######  ##      ##  ########" },
      { type: "text", content: "########  ##      ##  ##  ####    ####          ####  ##      ##  ########" },
      { type: "text", content: "########  ##########  ##      ##      ##  ##  ######  ##########  ########" },
      { type: "text", content: "########              ##  ##  ##  ##  ##  ##  ##  ##              ########" },
      { type: "text", content: "########################    ######  ########  ############################" },
      { type: "text", content: "########      ####    ##    ##      ##    ####  ##        ####    ########" },
      { type: "text", content: "########  ####  ########  ######  ######  ##    ####    ####  ##  ########" },
      { type: "text", content: "########  ##########          ##      ##    ##      ####      ##  ########" },
      { type: "text", content: "########    ##      ##  ####      ##      ########      ##  ##    ########" },
      { type: "text", content: "##########  ##  ####          ####    ##  ####  ####    ########  ########" },
      { type: "text", content: "##########          ####  ##  ####    ########  ##      ##  ####  ########" },
      { type: "text", content: "##########  ######      ##      ######  ##        ##    ##    ##  ########" },
      { type: "text", content: "############        ####  ##  ####  ####  ##  ############  ##  ##########" },
      { type: "text", content: "##############  ####  ########      ####  ####  ####  ####  ##  ##########" },
      { type: "text", content: "##########  ####  ##########  ##  ####      ##  ####    ##    ##  ########" },
      { type: "text", content: "########    ######    ##      ##        ##  ##  ##      ##  ####  ########" },
      { type: "text", content: "############        ##    ####    ##      ##########  ##    ##############" },
      { type: "text", content: "########      ##  ##    ##    ####    ##  ######            ##############" },
      { type: "text", content: "########################  ########        ####    ######  ##  ##  ########" },
      { type: "text", content: "########              ########  ######  ####  ##  ##  ##  ##  ##  ########" },
      { type: "text", content: "########  ##########  ##      ####  ##  ########  ######    ##  ##########" },
      { type: "text", content: "########  ##      ##  ####  ##      ##    ####              ##    ########" },
      { type: "text", content: "########  ##      ##  ####  ####  ####        ####  ##        ##  ########" },
      { type: "text", content: "########  ##      ##  ##  ##  ##              ##    ##      ##    ########" },
      { type: "text", content: "########  ##########  ##    ##    ##      ##                ##############" },
      { type: "text", content: "########              ##  ########    ##  ##  ##  ######    ####  ########" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "##########################################################################" },
      { type: "text", content: "##########################################################################" },
    ], 132); // 110 * 1.2 = 132
  }, [printLinesSlowly, printedTip]);

  return (
    <div className="space-y-10 text-[#e8c9dd]">
      <DashboardHeader 
        balance={latestBalance} 
        isConnected={isConnected}
        onShowProfile={handleShowProfile}
        onShowTrades={handleShowTrades}
        onShowTip={handleShowTip}
        profileVisible={printedProfile}
        tradesVisible={printedTrades}
        tipVisible={printedTip}
      />
      {terminalLines.length ? (
        <section className="space-y-0">
          {terminalLines.map((line, idx) => (
            <div key={idx}>
              {line.type === "prompt" ? (
                <div className="whitespace-pre break-words">
                  <span className="text-[#ff71cd]">rektbot9000@alby:~$ </span>
                  <span className="text-[#8C7F8C]">{line.command}</span>
                </div>
              ) : line.type === "status" ? (
                <div className="whitespace-pre break-words">
                  <span className="text-[#E8C9DD]">[</span>
                  <span className="text-[#5AE6FF]">ok</span>
                  <span className="text-[#E8C9DD]">] uplink established</span>
                </div>
              ) : line.type === "link" ? (
                <div className="break-words">
                  <a
                    href={line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8C7F8C] underline hover:text-[#8C7F8C]/80 transition-colors"
                  >
                    {line.label}
                  </a>
                </div>
              ) : line.type === "trade" ? (
                <div className="whitespace-pre break-words text-[#e8c9dd]">
                  {line.content.split(/(LONG|SHORT)/).map((part, i) => {
                    if (part === "LONG") {
                      return <span key={i} className="text-[#00ff00]">{part}</span>;
                    }
                    if (part === "SHORT") {
                      return <span key={i} className="text-[#ff5050]">{part}</span>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
              ) : (
                <div className="whitespace-pre break-words text-[#e8c9dd]">{line.content}</div>
              )}
            </div>
          ))}
        </section>
      ) : null}
      {introComplete && (
        <section>
          <BalanceChart data={balances} />
        </section>
      )}
      <footer className="mt-20 mb-8 text-center">
        <div className="text-xs text-[#8C7F8C]">Made with greed by Alby</div>
      </footer>
    </div>
  );
}

