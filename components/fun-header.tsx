"use client";

import { Sparkles } from "lucide-react";

export function FunHeader() {
  return (
    <header className="rounded-3xl bg-white/80 p-6 shadow-xl shadow-rekt-pink/30 ring-4 ring-rekt-green/40 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rekt-purple/10 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-rekt-purple">
            <Sparkles className="h-4 w-4 text-rekt-pink" />
            Live from the Nostr pits
          </div>
          <h1 className="mt-4 text-4xl font-black text-rekt-purple drop-shadow-sm md:text-5xl">
            Rektbot 9000 Mayhem Monitor
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
            Watch the chaotic life of a Bitcoin-trading robot unfold in real-time. Every
            balance update and every frantic BUY/SELL is blasted on Nostr by our bot
            pal. If the balance tanks to zero, Rektbot 9000 flatlines—so toss it some
            sats and keep the madness alive.
          </p>
        </div>
      </div>
    </header>
  );
}

