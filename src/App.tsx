import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import MonthCalendar from './components/MonthCalendar';
import WeekCalendar from './components/WeekCalendar';
import DayView from './components/DayView';
import PostDetailModal from './components/PostDetailModal';
import NewPostForm from './components/NewPostForm';
import ImportPedModal from './components/ImportPedModal';
import ClientFilter from './components/ClientFilter';
import ToastContainer, { type ToastItem } from './components/ToastContainer';
import SaveIndicator from './components/SaveIndicator';
import { mockPosts } from './data/mockPosts';
import { getToday } from './lib/postDisplay';
import { loadClienti, loadPosts, saveClienti, savePosts, POSTS_KEY, CLIENTI_KEY } from './lib/storage';
import type { Post, PostStatus } from './types/post';

type View = 'mese' | 'settimana' | 'giorno';

const VIEWS: { key: View; label: string }[] = [
  { key: 'mese', label: 'Mese' },
  { key: 'settimana', label: 'Settimana' },
  { key: 'giorno', label: 'Giorno' },
];

const DEFAULT_CLIENTI = ['Festival Lettura Demo', 'Studio Demo'];

function App() {
  const [posts, setPosts] = useState<Post[]>(() => loadPosts() ?? mockPosts);
  const [clienti, setClienti] = useState<string[]>(() => loadClienti() ?? DEFAULT_CLIENTI);
  const [view, setView] = useState<View>('mese');
  const [currentDate, setCurrentDate] = useState<string>(getToday());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedClienti, setSelectedClienti] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isImportPedOpen, setIsImportPedOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const hasMountedRef = useRef(false);

  useEffect(() => {
    const postsJson = JSON.stringify(posts);
    const clientiJson = JSON.stringify(clienti);
    const alreadyInSync =
      localStorage.getItem(POSTS_KEY) === postsJson &&
      localStorage.getItem(CLIENTI_KEY) === clientiJson;

    if (alreadyInSync) {
      hasMountedRef.current = true;
      return;
    }

    savePosts(posts);
    saveClienti(clienti);

    // La primissima scrittura (localStorage vuoto -> seed con i dati iniziali)
    // non è un salvataggio innescato dall'utente: nessun indicatore per quella.
    const isInitialSeed = !hasMountedRef.current;
    hasMountedRef.current = true;
    if (isInitialSeed) {
      return;
    }

    setShowSaved(true);
    const timeout = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [posts, clienti]);

  const addToast = (message: string, type: ToastItem['type']) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const clienteFilteredPosts = useMemo(
    () =>
      selectedClienti.length === 0
        ? posts
        : posts.filter((post) => selectedClienti.includes(post.cliente)),
    [posts, selectedClienti],
  );

  const visiblePosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return clienteFilteredPosts;
    return clienteFilteredPosts.filter(
      (post) =>
        post.argomento.toLowerCase().includes(query) ||
        post.captions.toLowerCase().includes(query),
    );
  }, [clienteFilteredPosts, searchQuery]);

  const hasActiveFilters = selectedClienti.length > 0 || searchQuery.trim().length > 0;

  const handleSelectDate = (date: string) => {
    setCurrentDate(date);
    setSelectedDate(date);
  };

  const handleCreatePost = (post: Post) => {
    setPosts((prev) => [...prev, post]);
    setIsNewPostOpen(false);
    setSelectedDate(null);
    addToast('Post creato con successo', 'success');
  };

  const handleAddCliente = (cliente: string) => {
    if (clienti.includes(cliente)) {
      return;
    }
    setClienti((prev) => (prev.includes(cliente) ? prev : [...prev, cliente]));
    addToast('Cliente aggiunto', 'success');
  };

  const handleImportPosts = (imported: Post[], unrecognizedCount: number) => {
    setPosts((prev) => [...prev, ...imported]);
    addToast(`${imported.length} post importati dal PED`, 'success');
    if (unrecognizedCount > 0) {
      addToast('Alcuni blocchi non riconosciuti, controllali', 'warning');
    }
  };

  const handleQuickCreate = () => {
    setSelectedDate(null);
    setIsNewPostOpen(true);
  };

  const handleUpdateStatus = (postId: string, nuovoStato: PostStatus) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, stato: nuovoStato } : post)),
    );
    addToast('Stato aggiornato', 'success');
  };

  const selectedPosts = selectedDate
    ? visiblePosts.filter((post) => post.data === selectedDate)
    : [];
  const showDetailModal = (view === 'mese' || view === 'settimana') && selectedDate !== null;

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <div className="py-10">
        <StatsDashboard posts={posts} />

        <div className="flex justify-center gap-3 mb-10">
          {VIEWS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`px-5 py-2 rounded-sm text-sm font-medium transition-colors border border-ink ${
                view === key ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-surface'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center flex-wrap gap-4 mb-12">
          <span className="text-sm font-medium text-ink-secondary">Cliente</span>
          <ClientFilter clienti={clienti} selected={selectedClienti} onChange={setSelectedClienti} />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per argomento o testo..."
            className="px-4 py-2 text-sm rounded-sm border border-line bg-paper text-ink w-56"
          />

          <button
            type="button"
            onClick={() => setIsNewPostOpen(true)}
            className="px-5 py-2 text-sm font-medium rounded-sm bg-ink text-white hover:bg-ink-secondary active:scale-95 transition-transform"
          >
            + Nuovo post
          </button>

          <button
            type="button"
            onClick={() => setIsImportPedOpen(true)}
            className="px-5 py-2 text-sm font-medium rounded-sm bg-ink text-white hover:bg-ink-secondary active:scale-95 transition-transform"
          >
            Importa PED
          </button>
        </div>

        {view === 'mese' && (
          <MonthCalendar
            currentDate={currentDate}
            posts={visiblePosts}
            hasActiveFilters={hasActiveFilters}
            selectedDate={selectedDate}
            onNavigate={setCurrentDate}
            onSelectDate={handleSelectDate}
          />
        )}
        {view === 'settimana' && (
          <WeekCalendar
            currentDate={currentDate}
            posts={visiblePosts}
            hasActiveFilters={hasActiveFilters}
            selectedDate={selectedDate}
            onNavigate={setCurrentDate}
            onSelectDate={handleSelectDate}
          />
        )}
        {view === 'giorno' && (
          <DayView
            currentDate={currentDate}
            posts={visiblePosts}
            onNavigate={setCurrentDate}
            onCreatePost={handleQuickCreate}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {showDetailModal && (
          <PostDetailModal
            date={selectedDate}
            posts={selectedPosts}
            onClose={() => setSelectedDate(null)}
            onCreatePost={handleQuickCreate}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {isNewPostOpen && (
          <NewPostForm
            defaultDate={selectedDate ?? currentDate}
            clienti={clienti}
            onAddCliente={handleAddCliente}
            onSave={handleCreatePost}
            onClose={() => setIsNewPostOpen(false)}
          />
        )}

        {isImportPedOpen && (
          <ImportPedModal
            clienti={clienti}
            onAddCliente={handleAddCliente}
            onImport={handleImportPosts}
            onClose={() => setIsImportPedOpen(false)}
          />
        )}

        <ToastContainer toasts={toasts} />
        <SaveIndicator visible={showSaved} />
      </div>
    </div>
  );
}

export default App;
