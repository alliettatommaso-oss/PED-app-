import { useState } from 'react';

interface ClientFilterProps {
  clienti: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function ClientFilter({ clienti, selected, onChange }: ClientFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allChecked = clienti.length > 0 && selected.length === clienti.length;

  const toggleTutti = () => {
    onChange(allChecked ? [] : [...clienti]);
  };

  const toggleCliente = (cliente: string) => {
    onChange(
      selected.includes(cliente) ? selected.filter((c) => c !== cliente) : [...selected, cliente],
    );
  };

  const label =
    selected.length === 0 || allChecked
      ? 'Tutti'
      : selected.length === 1
        ? selected[0]
        : `${selected.length} clienti`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="px-4 py-2 text-sm rounded-sm border border-ink bg-paper text-ink hover:bg-surface flex items-center gap-1.5 max-w-56"
      >
        <span className="truncate">{label}</span>
        <span className="text-ink-secondary text-xs">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-56 bg-paper border border-ink rounded-sm p-2">
            <label className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-surface cursor-pointer font-medium border-b border-line mb-1">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleTutti}
                className="accent-black"
              />
              Tutti
            </label>
            {clienti.map((cliente) => (
              <label
                key={cliente}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-surface cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(cliente)}
                  onChange={() => toggleCliente(cliente)}
                  className="accent-black"
                />
                <span className="truncate">{cliente}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ClientFilter;
