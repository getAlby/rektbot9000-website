"use client";

import { useEffect, useMemo, useState } from "react";

type TerminalLine = {
  id: string;
  content: string;
  showCursor?: boolean;
  parts?: Array<{ text: string; color: string }>;
};

const COMMAND = "rektbot9000@alby:~$ ./rektbot9000 --panic";
const ASCII_ART = [
  "    ____   ______ __ __ ______ ____   ____  ______",
  "   / __ \\ / ____// //_//_  __// __ ) / __ \\/_  __/",
  "  / /_/ // __/  / ,<    / /  / __  |/ / / / / /   ",
  " / _, _// /___ / /| |  / /  / /_/ // /_/ / / /    ",
  "/_/ |_|/_____//_/ |_| /_/  /_____/ \\____/ /_/     ",
  "                                                  ",
  "   ____   ____   ____   ____                      ",
  "  / __ \\ / __ \\ / __ \\ / __ \\                     ",
  " / /_/ // / / // / / // / / /                     ",
  " \\__, // /_/ // /_/ // /_/ /                      ",
  "/____/ \\____/ \\____/ \\____/                       ",
  "                                                  ",
];

const BOOT_LINES = [
  { id: "boot-1", text: "[ok] system boot sequence complete", statusColor: "#5AE6FF" },
  { id: "boot-2", text: "[..] nostr connection pending", statusColor: "#E8C9DD", isNostrStatus: true },
  { id: "boot-3", text: "[ok] wallet connection established", statusColor: "#5AE6FF" },
  { id: "boot-4", text: "[ok] trade module initialized", statusColor: "#5AE6FF" },
  { id: "boot-5", text: "[fail] risk management daemon not found", statusColor: "#FF5050" },
  { id: "boot-empty", text: "", statusColor: "#E8C9DD" },
];

const INTRO_LINES = [
  "> hello human. i am rektbot 9000.",
  "> mission: trade bitcoin. outcome: failure.",
  "> my sats balance is my heartbeat.",
  "> when it flatlines, so do i.",
  "> every move broadcast on nostr.",
  "> tip me if you enjoy slow-motion disasters.",
];

const NOSTR_STATUS_ID = "boot-2";

export function useTerminalIntro(balance: number, isConnected: boolean) {
  const [command, setCommand] = useState("$");
  const [commandDone, setCommandDone] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    setLines([]);
    setCommand("$");
    setCommandDone(false);
    setIntroComplete(false);

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

    // Print ASCII art
    ASCII_ART.forEach((line, idx) => {
      delay += 30;
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { 
            id: `ascii-${idx}`, 
            content: line,
            parts: [{ text: line, color: "#ff71cd" }]
          }]);
        }, delay)
      );
    });

    // Print boot sequence
    BOOT_LINES.forEach((bootLine, idx) => {
      delay += 180;
      timers.push(
        setTimeout(() => {
          const match = bootLine.text.match(/^(\[)(ok|fail|\.\.)?(\])(.*)/);
          const parts = match 
            ? [
                { text: match[1], color: "#E8C9DD" }, // opening bracket
                { text: match[2], color: bootLine.statusColor }, // status text
                { text: match[3], color: "#E8C9DD" }, // closing bracket
                { text: match[4], color: "#E8C9DD" } // rest of text
              ]
            : [{ text: bootLine.text, color: "#E8C9DD" }];
          
          setLines((prev) => [...prev, {
            id: bootLine.id,
            content: bootLine.text,
            parts,
          }]);
        }, delay)
      );
    });

    // Add space after boot sequence
    delay += 180;
    timers.push(
      setTimeout(() => {
        setLines((prev) => [...prev, { 
          id: "space-after-boot", 
          content: "",
          parts: [{ text: "", color: "#E8C9DD" }]
        }]);
      }, delay)
    );

    // Print intro lines
    INTRO_LINES.forEach((content, idx) => {
      delay += 200;
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { 
            id: `intro-${idx}`, 
            content,
            parts: [{ text: content, color: "#E8C9DD" }]
          }]);
        }, delay)
      );
    });

    // Add balance line
    delay += 200;
    timers.push(
      setTimeout(() => {
        setLines((prev) => [...prev, { 
          id: "balance-line", 
          content: `> current life balance: ${balance.toLocaleString()} sats`,
          parts: [
            { text: "> current life balance: ", color: "#E8C9DD" },
            { text: `${balance.toLocaleString()} sats`, color: "#ff71cd" }
          ]
        }]);
      }, delay)
    );

    // Mark intro as complete
    delay += 200;
    timers.push(
      setTimeout(() => {
        setIntroComplete(true);
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [commandDone]);

  // Update Nostr connection status when connected
  useEffect(() => {
    if (!isConnected || !commandDone) return;
    
    setLines((prev) => prev.map((line) => {
      if (line.id === NOSTR_STATUS_ID) {
        return {
          ...line,
          content: "[ok] nostr connection established",
          parts: [
            { text: "[", color: "#E8C9DD" },
            { text: "ok", color: "#5AE6FF" },
            { text: "]", color: "#E8C9DD" },
            { text: " nostr connection established", color: "#E8C9DD" }
          ]
        };
      }
      return line;
    }));
  }, [isConnected, commandDone]);

  // Update balance line when balance changes
  useEffect(() => {
    if (!commandDone) return;
    
    setLines((prev) => prev.map((line) => {
      if (line.id === "balance-line") {
        return {
          ...line,
          content: `> current life balance: ${balance.toLocaleString()} sats`,
          parts: [
            { text: "> current life balance: ", color: "#E8C9DD" },
            { text: `${balance.toLocaleString()} sats`, color: "#ff71cd" }
          ]
        };
      }
      return line;
    }));
  }, [balance, commandDone]);

  return useMemo(
    () => ({
      command,
      commandDone,
      lines,
      introComplete,
    }),
    [command, commandDone, lines, introComplete]
  );
}

