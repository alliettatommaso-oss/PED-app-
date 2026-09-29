function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs text-ink-secondary">
      <span className="font-medium text-ink">Stato di avanzamento:</span>
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-sm border-2 border-red-500" />
        <span>Bozza</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-sm border-2 border-yellow-500" />
        <span>Approvato</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-sm border-2 border-green-500" />
        <span>Pubblicato</span>
      </div>
    </div>
  );
}

export default StatusLegend;
