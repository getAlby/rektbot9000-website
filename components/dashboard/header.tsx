"use client";

import clsx from "clsx";
import { useTerminalIntro } from "@/hooks/use-terminal-intro";

export function DashboardHeader({ balance, isConnected }: { balance: number; isConnected: boolean }) {
  const { command, commandDone, lines } = useTerminalIntro(balance, isConnected);

  const promptEnd = "rektbot9000@alby:~$ ";
  const promptPart = command.slice(0, promptEnd.length);
  const commandPart = command.slice(promptEnd.length);

  return (
    <section className="space-y-4">
      <div className="whitespace-pre">
        <span className="text-[#ff71cd]">{promptPart}</span>
        <span className="text-[#8C7F8C]">{commandPart}</span>
        {!commandDone ? (
          <span className="animate-terminal-cursor text-[#8C7F8C]">█</span>
        ) : null}
      </div>
      {commandDone ? (
        <div className="space-y-2">
          {lines.map((line) => (
            <div key={line.id} className="whitespace-pre">
              {line.parts ? (
                line.parts.map((part, idx) => (
                  <span key={idx} style={{ color: part.color }}>
                    {part.text}
                  </span>
                ))
              ) : (
                <span style={{ color: "#E8C9DD" }}>{line.content}</span>
              )}
              {line.showCursor ? <span className="animate-terminal-cursor">█</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

