import "./globals.css";

import { NostrProvider } from "@/components/nostr-provider";

export const metadata = {
  title: "Rektbot 9000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-transparent text-accent font-mono">
        <NostrProvider>
          <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#ff71cd26] bg-[#0d050d]/90 shadow-[0_50px_120px_rgba(255,113,205,0.25)] backdrop-blur-lg">
              <header className="flex items-center gap-2 border-b border-[#ff71cd26] bg-[#1a0a16]/80 px-4 py-3 text-xs uppercase tracking-[0.2em] text-accent/70">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="ml-4 text-accent/60">rektbot9000</span>
                <span className="ml-auto text-accent/40">terminal</span>
              </header>
              <main className="relative z-10 space-y-12 px-8 py-10">{children}</main>
            </div>
          </div>
        </NostrProvider>
      </body>
    </html>
  );
}

