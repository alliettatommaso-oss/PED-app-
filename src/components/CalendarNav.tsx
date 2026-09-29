interface CalendarNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

function CalendarNav({ label, onPrev, onNext, onToday }: CalendarNavProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Precedente"
          className="px-3 py-2 rounded-sm border border-ink bg-paper text-ink hover:bg-surface text-lg leading-none"
        >
          &#8249;
        </button>
        <button
          type="button"
          onClick={onToday}
          className="px-3 py-1 text-xs font-medium rounded-sm border border-ink bg-paper text-ink hover:bg-surface"
        >
          Oggi
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Successivo"
          className="px-3 py-2 rounded-sm border border-ink bg-paper text-ink hover:bg-surface text-lg leading-none"
        >
          &#8250;
        </button>
      </div>

      <h2 className="text-4xl font-bold text-center capitalize">{label}</h2>
    </div>
  );
}

export default CalendarNav;
