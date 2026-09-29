import { useState, type ChangeEvent } from 'react';
import { TYPE_LABELS, STATUS_LABELS } from '../lib/postDisplay';
import { extractPdfText } from '../utils/pdfText';
import { parsePedText } from '../utils/pedParser';
import ClienteSelect from './ClienteSelect';
import type { ContentType, Post, PostStatus } from '../types/post';

const CONTENT_TYPES: ContentType[] = ['carosello', 'reels', 'statico'];
const STATUSES: PostStatus[] = ['bozza', 'approvato', 'pubblicato'];

const TESTO_ESEMPIO = `15/08/2026
Tipo: Reel
Orario: 18:00
Cliente: Wedoo
Argomento: ...
Caption: ...
---`;

interface ImportPedModalProps {
  clienti: string[];
  onAddCliente: (cliente: string) => void;
  onImport: (posts: Post[], unrecognizedCount: number) => void;
  onClose: () => void;
}

type Mode = 'pdf' | 'testo';
type Stage = 'select' | 'loading' | 'preview' | 'error';

function toDraftPost(partial: Partial<Post>): Post {
  return {
    id: crypto.randomUUID(),
    data: partial.data ?? '',
    tipo: partial.tipo ?? 'carosello',
    orario: partial.orario ?? '',
    argomento: partial.argomento ?? '',
    captions: partial.captions ?? '',
    stato: 'bozza',
    cliente: partial.cliente ?? '',
  };
}

function ImportPedModal({ clienti, onAddCliente, onImport, onClose }: ImportPedModalProps) {
  const [mode, setMode] = useState<Mode>('pdf');
  const [stage, setStage] = useState<Stage>('select');
  const [errorMessage, setErrorMessage] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [unrecognized, setUnrecognized] = useState<string[]>([]);

  const handleTabChange = (nextMode: Mode) => {
    setMode(nextMode);
    setStage('select');
    setErrorMessage('');
    setDrafts([]);
    setUnrecognized([]);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setStage('loading');
    try {
      const testo = await extractPdfText(file);
      const result = parsePedText(testo);
      setDrafts(result.posts.map(toDraftPost));
      setUnrecognized(result.unrecognized);
      setStage('preview');
    } catch {
      setErrorMessage('Impossibile leggere il PDF. Riprova con un altro file.');
      setStage('error');
    }
  };

  const handleAnalyzeText = () => {
    const result = parsePedText(pastedText);
    setDrafts(result.posts.map(toDraftPost));
    setUnrecognized(result.unrecognized);
    setStage('preview');
  };

  const updateDraft = (id: string, patch: Partial<Post>) => {
    setDrafts((prev) => prev.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)));
  };

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
  };

  const handleImportAll = () => {
    const nuoviClienti = Array.from(
      new Set(
        drafts
          .map((draft) => draft.cliente.trim())
          .filter((cliente) => cliente && !clienti.includes(cliente)),
      ),
    );
    nuoviClienti.forEach(onAddCliente);
    onImport(
      drafts.map((draft) => ({ ...draft, cliente: draft.cliente.trim() })),
      unrecognized.length,
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-paper border border-ink rounded-sm w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative"
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

        <h3 className="text-xl font-bold mb-5">Importa PED</h3>

        {(stage === 'select' || stage === 'error') && (
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => handleTabChange('pdf')}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm border border-ink ${
                mode === 'pdf' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-surface'
              }`}
            >
              Da PDF
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('testo')}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm border border-ink ${
                mode === 'testo' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-surface'
              }`}
            >
              Incolla testo
            </button>
          </div>
        )}

        {stage === 'select' && mode === 'pdf' && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink-secondary">
              Seleziona il file PDF del piano editoriale da importare. I blocchi devono essere
              separati da righe "---", con data, tipo, orario, cliente, argomento e caption.
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-sm file:border file:border-ink file:bg-ink file:text-white file:text-sm hover:file:bg-ink-secondary"
            />
          </div>
        )}

        {stage === 'error' && mode === 'pdf' && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink-secondary">
              Seleziona il file PDF del piano editoriale da importare. I blocchi devono essere
              separati da righe "---", con data, tipo, orario, cliente, argomento e caption.
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-sm file:border file:border-ink file:bg-ink file:text-white file:text-sm hover:file:bg-ink-secondary"
            />
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {stage === 'select' && mode === 'testo' && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink-secondary">
              Incolla il testo del piano editoriale. Un blocco per post, separato da una riga
              "---", con data, tipo, orario, cliente, argomento e caption. Esempio:
            </p>
            <pre className="text-xs text-ink-secondary bg-surface border border-line rounded-sm p-3 whitespace-pre-wrap">
              {TESTO_ESEMPIO}
            </pre>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={15}
              placeholder={'15/08/2026\nTipo: Reel\nOrario: 18:00\nCliente: Wedoo\nArgomento: ...\nCaption: ...\n---'}
              className="w-full border border-line rounded-sm px-3 py-2 text-sm text-ink font-mono resize-y"
            />
            <button
              type="button"
              onClick={handleAnalyzeText}
              disabled={pastedText.trim().length === 0}
              className="self-start bg-ink text-white text-sm font-medium rounded-sm px-5 py-2 hover:bg-ink-secondary active:scale-95 transition-transform disabled:opacity-50 disabled:hover:bg-ink disabled:active:scale-100"
            >
              Analizza testo
            </button>
          </div>
        )}

        {stage === 'loading' && (
          <p className="text-sm text-ink-secondary">Estrazione del testo dal PDF in corso...</p>
        )}

        {stage === 'preview' && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-ink-secondary">
              {drafts.length} post riconosciuti. Controlla e correggi i campi prima di importare.
            </p>

            <div className="flex flex-col gap-4">
              {drafts.map((draft, index) => (
                <div key={draft.id} className="border border-line rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-ink-secondary">Post {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeDraft(draft.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium text-ink-secondary">
                      Data
                      <input
                        type="date"
                        value={draft.data}
                        onChange={(e) => updateDraft(draft.id, { data: e.target.value })}
                        className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
                      />
                    </label>
                    <label className="text-xs font-medium text-ink-secondary">
                      Orario
                      <input
                        type="time"
                        value={draft.orario}
                        onChange={(e) => updateDraft(draft.id, { orario: e.target.value })}
                        className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
                      />
                    </label>
                    <label className="text-xs font-medium text-ink-secondary">
                      Tipo
                      <select
                        value={draft.tipo}
                        onChange={(e) =>
                          updateDraft(draft.id, { tipo: e.target.value as ContentType })
                        }
                        className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
                      >
                        {CONTENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {TYPE_LABELS[t]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-medium text-ink-secondary">
                      Stato
                      <select
                        value={draft.stato}
                        onChange={(e) =>
                          updateDraft(draft.id, { stato: e.target.value as PostStatus })
                        }
                        className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-medium text-ink-secondary col-span-2">
                      Argomento
                      <input
                        type="text"
                        placeholder="Di cosa parla questo post?"
                        value={draft.argomento}
                        onChange={(e) => updateDraft(draft.id, { argomento: e.target.value })}
                        className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink"
                      />
                    </label>
                    <label className="text-xs font-medium text-ink-secondary col-span-2">
                      Captions
                      <textarea
                        placeholder="Scrivi il testo del post..."
                        value={draft.captions}
                        onChange={(e) => updateDraft(draft.id, { captions: e.target.value })}
                        rows={2}
                        className="mt-1 w-full border border-line rounded-sm px-2 py-1.5 text-sm text-ink resize-none"
                      />
                    </label>
                    <label className="text-xs font-medium text-ink-secondary col-span-2">
                      Cliente
                      <div className="mt-1">
                        <ClienteSelect
                          clienti={clienti}
                          value={draft.cliente}
                          onChange={(value) => updateDraft(draft.id, { cliente: value })}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              ))}

              {drafts.length === 0 && (
                <p className="text-sm text-ink-secondary">Nessun post riconosciuto.</p>
              )}
            </div>

            {unrecognized.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-ink mb-2">
                  Blocchi non riconosciuti ({unrecognized.length})
                </h4>
                <p className="text-xs text-ink-secondary mb-2">
                  Data o tipo mancanti/non validi: correggili a mano nel PED e reimportali.
                </p>
                <div className="flex flex-col gap-2">
                  {unrecognized.map((block, index) => (
                    <pre
                      key={index}
                      className="text-xs text-ink-secondary bg-surface border border-dashed border-line rounded-sm p-3 whitespace-pre-wrap"
                    >
                      {block}
                    </pre>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleImportAll}
              disabled={drafts.length === 0}
              className="bg-ink text-white text-sm font-medium rounded-sm py-2.5 hover:bg-ink-secondary active:scale-95 transition-transform disabled:opacity-50 disabled:hover:bg-ink disabled:active:scale-100"
            >
              Importa tutti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportPedModal;
