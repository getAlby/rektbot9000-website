import Link from "next/link";

export function TerminalFooterLinks() {
  return (
    <div className="flex flex-col gap-1 text-sm text-accent/70">
      <Link href="/trades" className="underline">
        &gt; cat ./trades.log --full
      </Link>
      <Link href="/widget" className="underline">
        &gt; cat ./tip-widget.sh
      </Link>
    </div>
  );
}

