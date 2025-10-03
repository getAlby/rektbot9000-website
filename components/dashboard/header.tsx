"use client";

import { useTerminalIntro } from "@/hooks/use-terminal-intro";

type DashboardHeaderProps = {
  balance: number;
  isConnected: boolean;
  onShowProfile: () => void;
  onShowTip: () => void;
  onShowTrades: () => void;
  profileVisible: boolean;
  tipVisible: boolean;
  tradesVisible: boolean;
};

export function DashboardHeader({ 
  balance, 
  isConnected, 
  onShowProfile,
  onShowTip,
  onShowTrades,
  profileVisible,
  tipVisible,
  tradesVisible
}: DashboardHeaderProps) {
  const { command, commandDone, lines } = useTerminalIntro(balance, isConnected);

  const promptEnd = "rektbot9000@alby:~$ ";
  const promptPart = command.slice(0, promptEnd.length);
  const commandPart = command.slice(promptEnd.length);

  return (
    <section className="space-y-4 break-words">
      <div className="whitespace-pre-wrap break-all overflow-hidden">
        <span className="text-[#ff71cd]">{promptPart}</span>
        <span className="text-[#8C7F8C]">{commandPart}</span>
        {!commandDone ? (
          <span className="animate-terminal-cursor text-[#8C7F8C]">█</span>
        ) : null}
      </div>
      {commandDone ? (
        <div className="space-y-2">
          {lines.map((line) => {
            const isAscii = line.id.startsWith("ascii");
            const isSpacer = line.parts?.every((part) => part.text === "");
            const lineClass = isAscii
              ? "whitespace-pre overflow-x-auto ascii-art"
              : "whitespace-pre-wrap break-words";

            return (
              <div key={line.id} className="space-y-1">
                {isSpacer ? (
                  <div className="h-2" />
                ) : (
                  <div className={lineClass}>
                    {line.parts
                      ? line.parts.map((part, idx) => (
                          <span key={idx} style={{ color: part.color }}>
                            {part.text}
                          </span>
                        ))
                      : (
                          <span style={{ color: "#E8C9DD" }}>{line.content}</span>
                        )}
                    {line.showCursor ? <span className="animate-terminal-cursor">█</span> : null}
                  </div>
                )}

                {/* Show command buttons under specific lines */}
                {line.id === "intro-broadcast" && (
                  <div className="whitespace-pre-wrap">
                    {profileVisible ? (
                      <span className="text-[#8C7F8C]/40">./open_nostr_profile.sh</span>
                    ) : (
                      <button
                        type="button"
                        onClick={onShowProfile}
                        className="text-[#8C7F8C] underline hover:text-[#8C7F8C]/80 transition-colors"
                      >
                        ./open_nostr_profile.sh
                      </button>
                    )}
                  </div>
                )}

                {line.id === "intro-tip" && (
                  <div className="whitespace-pre-wrap">
                    {tipVisible ? (
                      <span className="text-[#8C7F8C]/40">./fund_life.sh</span>
                    ) : (
                      <button
                        type="button"
                        onClick={onShowTip}
                        className="text-[#8C7F8C] underline hover:text-[#8C7F8C]/80 transition-colors"
                      >
                        ./fund_life.sh
                      </button>
                    )}
                  </div>
                )}

                {line.id === "intro-plead" && (
                  <div className="whitespace-pre-wrap">
                    {tradesVisible ? (
                      <span className="text-[#8C7F8C]/40">./tail_trades.sh --tail 16</span>
                    ) : (
                      <button
                        type="button"
                        onClick={onShowTrades}
                        className="text-[#8C7F8C] underline hover:text-[#8C7F8C]/80 transition-colors"
                      >
                        ./tail_trades.sh --tail 16
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

