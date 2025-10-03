"use client";

import clsx from "clsx";
import { useTerminalIntro } from "@/hooks/use-terminal-intro";

export function DashboardHeader({ balance }: { balance: number }) {
  const { command, commandDone, lines } = useTerminalIntro(balance);

  return (
    <section className="space-y-4 text-[#e8c9dd]">
      <div className="whitespace-pre text-accent">
        {command}
        {!commandDone ? <span className="animate-terminal-cursor text-accent">█</span> : null}
      </div>
      {commandDone ? (
        <div className="space-y-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className={clsx("whitespace-pre", {
                "text-accent": line.id.startsWith("ascii-"),
                "text-[#e8c9dd]": !line.id.startsWith("ascii-"),
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

