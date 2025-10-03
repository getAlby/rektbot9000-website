export function TerminalFooterLinks({
  onShowProfile,
  onShowTrades,
  onShowTip,
  profileVisible,
  tradesVisible,
  tipVisible,
}: {
  onShowProfile: () => void;
  onShowTrades: () => void;
  onShowTip: () => void;
  profileVisible: boolean;
  tradesVisible: boolean;
  tipVisible: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      {!profileVisible ? (
        <button
          type="button"
          className="underline text-left text-[#8C7F8C] hover:text-[#8C7F8C]/80 transition-colors"
          onClick={onShowProfile}
        >
          ./open_nostr_profile.sh
        </button>
      ) : (
        <span className="text-[#8C7F8C]/40">./open_nostr_profile.sh</span>
      )}
      {!tipVisible ? (
        <button
          type="button"
          className="underline text-left text-[#8C7F8C] hover:text-[#8C7F8C]/80 transition-colors"
          onClick={onShowTip}
        >
          ./fund_life.sh
        </button>
      ) : (
        <span className="text-[#8C7F8C]/40">./fund_life.sh</span>
      )}
      {!tradesVisible ? (
        <button
          type="button"
          className="underline text-left text-[#8C7F8C] hover:text-[#8C7F8C]/80 transition-colors"
          onClick={onShowTrades}
        >
          ./tail_trades.sh
        </button>
      ) : (
        <span className="text-[#8C7F8C]/40">./tail_trades.sh</span>
      )}
    </div>
  );
}

