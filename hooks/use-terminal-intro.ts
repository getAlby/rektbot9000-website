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
  "   ___   ____ __ __ ______ ___   ____  ______",
  "  / _ \\ / __// //_//_  __// _ ) / __ \\/_  __/",
  " / , _// _/ / ,<    / /  / _  |/ /_/ / / /   ",
  "/_/|_|/___//_/|_|  /_/  /____/ \\____/ /_/    ",
  "  ___   ___   ___   ___                      ",
  " / _ \\ / _ \\ / _ \\ / _ \\                     ",
  " \\_, // // // // // // /                     ",
  "/___/ \\___/ \\___/ \\___/                      ",
  "                                             ",
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
  { id: "intro-hello", text: "> hello human. i am rektbot9000.", highlight: "i am rektbot9000" },
  { id: "intro-mission", text: "> mission: trade bitcoin. outcome: failure." },
  { id: "intro-heartbeat", text: "> my sats balance is my heartbeat." },
  { id: "intro-flatline", text: "> when it flatlines, so do i." },
  { id: "intro-space-1", text: "" },
  { id: "intro-broadcast", text: "> i broadcast every move on nostr." },
  { id: "intro-space-2", text: "" },
  { id: "intro-tip", text: "> tip me if you enjoy slow-motion disasters." },
  { id: "intro-space-3", text: "" },
  { id: "intro-plead", text: "> please don't laugh at my terrible financial decisions." },
];

const NOSTR_STATUS_ID = "boot-2";

export function useTerminalIntro(balance: number, isConnected: boolean) {
  const [command, setCommand] = useState("$");
  const [commandDone, setCommandDone] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [introComplete, setIntroComplete] = useState(false);
  const [currentIntroLine, setCurrentIntroLine] = useState(-1); // Start at -1 to prevent early typing
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

    // Print boot sequence - keep under ASCII banner
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

    // Add empty line after boot sequence AND ONLY THEN start intro typing
    delay += 300;
    timers.push(
      setTimeout(() => {
        setLines((prev) => [...prev, { 
          id: "space-after-boot", 
          content: "",
          parts: [{ text: "", color: "#E8C9DD" }]
        }]);
        // Start typing intro lines AFTER boot is complete
        setTimeout(() => {
          setCurrentIntroLine(0);
          setCurrentIntroText("");
        }, 100);
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [commandDone]);

  // Type out intro lines letter by letter
  useEffect(() => {
    // Don't start typing until currentIntroLine is set to 0 or greater
    if (currentIntroLine < 0) return;
    
    if (currentIntroLine >= INTRO_LINES.length) {
      // All intro lines typed, add empty line then balance line
      let cancelled = false;

      const timer1 = setTimeout(() => {
        if (cancelled) return;
        setLines((prev) => [...prev, { 
          id: "space-before-balance", 
          content: "",
          parts: [{ text: "", color: "#E8C9DD" }]
        }]);
      }, 200);

      const timer2 = setTimeout(() => {
        if (cancelled) return;
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
        if (cancelled) return;
        setIntroComplete(true);
      }, 600);

      return () => {
        cancelled = true;
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }

    const targetItem = INTRO_LINES[currentIntroLine];
    if (!targetItem) {
      return;
    }
    const targetLine = targetItem.text;
    
    if (currentIntroText.length < targetLine.length) {
      // Continue typing current line
      const timer = setTimeout(() => {
        setCurrentIntroText(targetLine.slice(0, currentIntroText.length + 1));
        setLines((prev) => {
          const existingIndex = prev.findIndex(line => line.id === targetItem.id);
          const currentText = targetLine.slice(0, currentIntroText.length + 1);
          
          // Check if we need to highlight part of the text
          let parts: Array<{ text: string; color: string }>;
          if (targetItem.highlight && currentText.includes(targetItem.highlight)) {
            const highlightStart = currentText.indexOf(targetItem.highlight);
            const before = currentText.slice(0, highlightStart);
            const highlighted = currentText.slice(highlightStart, highlightStart + targetItem.highlight.length);
            const after = currentText.slice(highlightStart + targetItem.highlight.length);
            
            parts = [
              ...(before ? [{ text: before, color: "#E8C9DD" }] : []),
              { text: highlighted, color: "#ff71cd" },
              ...(after ? [{ text: after, color: "#E8C9DD" }] : [])
            ];
          } else {
            parts = [{ text: currentText, color: "#E8C9DD" }];
          }
          
          const newLine = {
            id: targetItem.id,
            content: currentText,
            parts,
            showCursor: true
          };
          
          if (existingIndex >= 0) {
            // Update existing line in place
            const updated = [...prev];
            updated[existingIndex] = newLine;
            return updated;
          } else {
            // Add new line at the end
            return [...prev, newLine];
          }
        });
      }, 16);
      return () => clearTimeout(timer);
  } else {
      // Move to next line
      const timer = setTimeout(() => {
        setLines((prev) => {
          const withoutCursor = prev.map(line => 
            line.id === targetItem.id 
              ? { ...line, showCursor: false }
              : line
          );
          // If this target line is intentionally blank, ensure spacer exists
          if (targetLine.trim() === "") {
            const spacerId = `${targetItem.id}-spacer`;
            const hasSpacer = withoutCursor.some(line => line.id === spacerId);
            if (hasSpacer) {
              return withoutCursor;
            }
            return [
              ...withoutCursor,
              {
                id: spacerId,
                content: "",
                parts: [{ text: "", color: "#E8C9DD" }],
              },
            ];
          }
          return withoutCursor;
        });
        setCurrentIntroLine(prev => prev + 1);
        setCurrentIntroText("");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIntroLine, currentIntroText, balance]);

  // Update Nostr connection status when connected
  useEffect(() => {
    if (!isConnected || !commandDone) return;
    
    setLines((prev) => {
      const hasBootLine = prev.some(line => line.id === NOSTR_STATUS_ID);
      if (!hasBootLine) return prev; // Boot line not rendered yet
      
      return prev.map((line) => {
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
      });
    });
  }, [isConnected, commandDone, lines.length]); // Add lines.length as dependency

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

