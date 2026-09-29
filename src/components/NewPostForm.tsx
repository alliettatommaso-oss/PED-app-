import { useState, type FormEvent } from 'react';
import { TYPE_LABELS, STATUS_LABELS } from '../lib/postDisplay';
import ClienteSelect from './ClienteSelect';
import type { ContentType, Post, PostStatus } from '../types/post';

const CONTENT_TYPES: ContentType[] = ['carosello', 'reels', 'statico'];
const STATUSES: PostStatus[] = ['bozza', 'approvato', 'pubblicato'];

interface NewPostFormProps {
  defaultDate: string;
  clienti: string[];
  onAddCliente: (cliente: string) => void;
  onSave: (post: Post) => void;
  onClose: () => void;
}

function NewPostForm({ defaultDate, clienti, onAddCliente, onSave, onClose }: NewPostFormProps) {
  const [data, setData] = useState(defaultDate);
  const [tipo, setTipo] = useState<ContentType>('carosello');
  const [orario, setOrario] = useState('12:00');
  const [argomento, setArgomento] = useState('');
  const [captions, setCaptions] = useState('');
  const [stato, setStato] = useState<PostStatus>('bozza');
  const [cliente, setCliente] = useState(clienti[0] ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedCliente = cliente.trim();
    if (!trimmedCliente) {
      return;
    }
    if (!clienti.includes(trimmedCliente)) {
      onAddCliente(trimmedCliente);
    }

    onSave({
      id: crypto.randomUUID(),
      data,
      tipo,
      orario,
      argomento,
      captions,
      stato,
      cliente: trimmedCliente,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-paper border border-ink rounded-sm w-full max-w-md max-h-[85vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-secondary hover:text-ink text-xl leading-none"
          aria-label="Chiudi"
        >
          &times;
        </button>

        <h3 className="text-xl font-bold mb-5">Nuovo post</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <label className="flex-1 text-sm font-medium text-ink-secondary">
              Quando lo pubblichi?
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
              />
            </label>
            <label className="flex-1 text-sm font-medium text-ink-secondary">
              A che ora?
              <input
                type="time"
                required
                value={orario}
                onChange={(e) => setOrario(e.target.value)}
                className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
              />
            </label>
          </div>

          <label className="text-sm font-medium text-ink-secondary">
            Che formato è?
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as ContentType)}
              className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-ink-secondary">
            Argomento
            <input
              type="text"
              required
              placeholder="Di cosa parla questo post?"
              value={argomento}
              onChange={(e) => setArgomento(e.target.value)}
              className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
            />
          </label>

          <label className="text-sm font-medium text-ink-secondary">
            Captions
            <textarea
              required
              placeholder="Scrivi il testo del post..."
              value={captions}
              onChange={(e) => setCaptions(e.target.value)}
              rows={3}
              className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink resize-none"
            />
          </label>

          <label className="text-sm font-medium text-ink-secondary">
            Stato
            <select
              value={stato}
              onChange={(e) => setStato(e.target.value as PostStatus)}
              className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-ink-secondary">
            Cliente
            <div className="mt-1">
              <ClienteSelect clienti={clienti} value={cliente} onChange={setCliente} />
            </div>
          </label>

          <button
            type="submit"
            className="mt-2 bg-ink text-white text-sm font-medium rounded-sm py-2.5 hover:bg-ink-secondary active:scale-95 transition-transform"
          >
            Salva post
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPostForm;
