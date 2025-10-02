"use client";

import { useEffect, useState } from "react";

export function useTypedText(lines: string[], delay = 30) {
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const typed: string[] = [];
      for (const line of lines) {
        if (cancelled) return;
        let current = "";
        for (const char of line) {
          current += char;
          typed.push(current);
          setOutput([...typed]);
          await new Promise((resolve) => setTimeout(resolve, delay));
          typed.pop();
        }
        typed.push(current);
        setOutput([...typed]);
        await new Promise((resolve) => setTimeout(resolve, delay * 10));
      }
    }
    run();

    return () => {
      cancelled = true;
    };
  }, [lines, delay]);

  return output;
}

