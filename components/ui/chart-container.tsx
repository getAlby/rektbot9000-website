"use client";

import { type ReactNode } from "react";

export function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/80 p-6 shadow-xl shadow-rekt-purple/30 ring-4 ring-white/40 backdrop-blur-sm">
      <h2 className="text-lg font-bold uppercase tracking-widest text-rekt-purple">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

