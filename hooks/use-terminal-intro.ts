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
  const [currentIntroLine, setCurrentIntroLine] = useState(0);
  const [currentIntroText, setCurrentIntroText] = useState("");

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

    // Add empty line after boot sequence
    delay += 180;
    timers.push(
      setTimeout(() => {
        setLines((prev) => [...prev, { 
          id: "space-after-boot", 
          content: "",
          parts: [{ text: "", color: "#E8C9DD" }]
        }]);
        // Start typing intro lines
        setCurrentIntroLine(0);
        setCurrentIntroText("");
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [commandDone]);

  // Type out intro lines letter by letter
  useEffect(() => {
    if (currentIntroLine >= INTRO_LINES.length) {
      // All intro lines typed, add empty line then balance line
      const timer1 = setTimeout(() => {
        setLines((prev) => [...prev, { 
          id: "space-before-balance", 
          content: "",
          parts: [{ text: "", color: "#E8C9DD" }]
        }]);
      }, 200);

      const timer2 = setTimeout(() => {
        setLines((prev) => [...prev, { 
          id: "balance-line", 
          content: `> current life balance: ${balance.toLocaleString()} sats`,
          parts: [
            { text: "> current life balance: ", color: "#E8C9DD" },
            { text: `${balance.toLocaleString()} sats`, color: "#ff71cd" }
          ],
          showCursor: true
        }]);
      }, 400);

      const timer3 = setTimeout(() => {
        setIntroComplete(true);
      }, 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }

    const targetLine = INTRO_LINES[currentIntroLine];
    
    if (currentIntroText.length < targetLine.length) {
      // Continue typing current line
      const timer = setTimeout(() => {
        setCurrentIntroText(targetLine.slice(0, currentIntroText.length + 1));
        setLines((prev) => {
          const existing = prev.filter(line => line.id !== `intro-${currentIntroLine}`);
          return [...existing, {
            id: `intro-${currentIntroLine}`,
            content: targetLine.slice(0, currentIntroText.length + 1),
            parts: [{ text: targetLine.slice(0, currentIntroText.length + 1), color: "#E8C9DD" }],
            showCursor: true
          }];
        });
      }, 16);
      return () => clearTimeout(timer);
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setLines((prev) => prev.map(line => 
          line.id === `intro-${currentIntroLine}` 
            ? { ...line, showCursor: false }
            : line
        ));
        setCurrentIntroLine(prev => prev + 1);
        setCurrentIntroText("");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIntroLine, currentIntroText, balance]);

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

