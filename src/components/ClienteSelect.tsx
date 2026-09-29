import { useState } from 'react';

const NUOVO_CLIENTE_VALUE = '__nuovo_cliente__';

interface ClienteSelectProps {
  clienti: string[];
  value: string;
  onChange: (value: string) => void;
}

function ClienteSelect({ clienti, value, onChange }: ClienteSelectProps) {
  const isKnown = clienti.includes(value);
  const [mode, setMode] = useState<'existing' | 'nuovo'>(isKnown || value === '' ? 'existing' : 'nuovo');

  const selectValue =
    mode === 'nuovo' ? NUOVO_CLIENTE_VALUE : isKnown ? value : (clienti[0] ?? NUOVO_CLIENTE_VALUE);

  return (
    <div className="flex flex-col gap-1.5">
      <select
        value={selectValue}
        onChange={(e) => {
          if (e.target.value === NUOVO_CLIENTE_VALUE) {
            setMode('nuovo');
            onChange('');
          } else {
            setMode('existing');
            onChange(e.target.value);
          }
        }}
        className="w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
      >
        {clienti.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value={NUOVO_CLIENTE_VALUE}>+ Nuovo cliente</option>
      </select>

      {mode === 'nuovo' && (
        <input
          type="text"
          required
          placeholder="Come si chiama?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
        />
      )}
    </div>
  );
}

export default ClienteSelect;
