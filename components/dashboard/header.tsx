"use client";

import clsx from "clsx";
import { useTerminalIntro } from "@/hooks/use-terminal-intro";

export function DashboardHeader({ balance }: { balance: number }) {
  const { command, commandDone, lines } = useTerminalIntro(balance);

  return (
    <section className="space-y-4 text-accent">
      <div className="whitespace-pre text-accent/80">{command}</div>
      {commandDone ? (
        <div className="space-y-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className={clsx("whitespace-pre", {
                "text-accent": line.showCursor,
                "text-accent/80": !line.showCursor,
              })}
            >
              {line.content}
              {line.showCursor ? <span className="animate-terminal-cursor">█</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

