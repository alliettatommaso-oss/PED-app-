interface SaveIndicatorProps {
  visible: boolean;
}

function SaveIndicator({ visible }: SaveIndicatorProps) {
  return (
    <div
      className={`fixed bottom-6 left-6 z-[60] text-xs font-medium text-ink-secondary bg-surface border border-line rounded-sm px-3 py-1.5 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      Salvato ✓
    </div>
  );
}

export default SaveIndicator;
