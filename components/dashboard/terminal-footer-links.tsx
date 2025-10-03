export function TerminalFooterLinks({
  onShowTrades,
  onShowTip,
  tradesVisible,
  tipVisible,
}: {
  onShowTrades: () => void;
  onShowTip: () => void;
  tradesVisible: boolean;
  tipVisible: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 text-sm text-[#e8c9dd]/70">
      {!tradesVisible ? (
        <button
          type="button"
          className="underline text-left text-[#e8c9dd]"
          onClick={onShowTrades}
        >
          ./trades.sh
        </button>
      ) : (
        <span className="text-[#e8c9dd]/40">./trades.sh</span>
      )}
      {!tipVisible ? (
        <button
          type="button"
          className="underline text-left text-[#e8c9dd]"
          onClick={onShowTip}
        >
          ./tipREKTBOT9000.sh
        </button>
      ) : (
        <span className="text-[#e8c9dd]/40">./tipREKTBOT9000.sh</span>
      )}
    </div>
  );
}

