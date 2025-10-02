"use client";

import { useEffect, useMemo, useState } from "react";

type TerminalLine = {
  id: string;
  content: string;
  showCursor?: boolean;
};

const COMMAND = "rektbot9000@alby:~$ ./lets_fucking_go.sh";
const ASCII_ART = [
  "      :::::::::       ::::::::::       :::    :::   ::::::::::: ",
  "     :+:    :+:      :+:              :+:   :+:        :+:      ",
  "    +:+    +:+      +:+              +:+  +:+         +:+       ",
  "   +#++:++#:       +#++:++#         +#++:++          +#+        ",
  "  +#+    +#+      +#+              +#+  +#+         +#+         ",
  " #+#    #+#      #+#              #+#   #+#        #+#          ",
  "###    ###      ##########       ###    ###       ###           ",
  "      ::::::::       :::::::       :::::::       :::::::        ",
  "    :+:    :+:     :+:   :+:     :+:   :+:     :+:   :+:        ",
  "   +:+    +:+     +:+   +:+     +:+   +:+     +:+   +:+         ",
  "   +#++:++#+     +#+   +:+     +#+   +:+     +#+   +:+          ",
  "        +#+     +#+   +#+     +#+   +#+     +#+   +#+           ",
  "+#+    #+#     #+#   #+#     #+#   #+#     #+#   #+#            ",
  "########       #######       #######       #######              ",
];

const INTRO_LINES = [
  "> welcome to rektbot 9000 terminal.",
  "> bot streams trades on nostr and dies at balance <= 0.",
];

const SECTION_LINES = [
  { id: "balance-title", content: "> balance history" },
  { id: "balance-note", content: "(no balance data yet)" },
  { id: "trade-title", content: "> trade log" },
  { id: "trade-note", content: "(waiting for trades)" },
];

const BALANCE_LINE_ID = "balance-line";

export function useTerminalIntro(balance: number) {
  const [command, setCommand] = useState("$");
  const [commandDone, setCommandDone] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    setLines([]);
    setCommand("$");
    setCommandDone(false);

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setCommand(COMMAND.slice(0, index));
      if (index >= COMMAND.length) {
        clearInterval(timer);
        setCommandDone(true);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!commandDone) return;

    const timers: NodeJS.Timeout[] = [];
    let delay = 120;

    ASCII_ART.forEach((line, idx) => {
      delay += 30;
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { id: `ascii-${idx}`, content: line }]);
        }, delay)
      );
    });

    INTRO_LINES.forEach((content, idx) => {
      delay += 260;
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { id: `intro-${idx}`, content }]);
        }, delay)
      );
    });

    delay += 260;
    timers.push(
      setTimeout(() => {
        setLines((prev) => [
          ...prev.map((line) => ({ ...line, showCursor: false })),
          {
            id: BALANCE_LINE_ID,
            content: `> active balance: ${balance.toLocaleString()} sats.`,
            showCursor: true,
          },
        ]);
      }, delay)
    );

    SECTION_LINES.forEach((line, idx) => {
      delay += 240;
      timers.push(
        setTimeout(() => {
          setLines((prev) => [
            ...prev.map((existing) => ({ ...existing, showCursor: false })),
            { ...line, showCursor: idx === SECTION_LINES.length - 1 },
          ]);
        }, delay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [commandDone, balance]);

  useEffect(() => {
    if (!commandDone) return;
    setLines((prev) =>
      prev.map((line) =>
        line.id === BALANCE_LINE_ID
          ? { ...line, content: `> active balance: ${balance.toLocaleString()} sats.`, showCursor: true }
          : line
      )
    );
  }, [balance, commandDone]);

  return useMemo(
    () => ({
      command,
      commandDone,
      lines,
    }),
    [command, commandDone, lines]
  );
}

