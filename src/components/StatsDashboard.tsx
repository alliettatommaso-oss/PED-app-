import { useEffect, useRef, useState } from 'react';
import { CalendarDays, PenLine, Send, Users } from 'lucide-react';
import { getToday } from '../lib/postDisplay';
import type { Post } from '../types/post';

interface StatsDashboardProps {
  posts: Post[];
}

function useHighlightOnChange(value: number, duration = 400): boolean {
  const [highlight, setHighlight] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current === value) {
      return;
    }
    previousValue.current = value;
    setHighlight(true);
    const timeout = setTimeout(() => setHighlight(false), duration);
    return () => clearTimeout(timeout);
  }, [value, duration]);

  return highlight;
}

interface StatCardProps {
  icon: typeof CalendarDays;
  label: string;
  value: number;
  alert: boolean;
}

function StatCard({ icon: Icon, label, value, alert }: StatCardProps) {
  const highlight = useHighlightOnChange(value);

  return (
    <div
      className={`border rounded-sm p-5 flex flex-col gap-2 ${
        alert ? 'border-accent animate-pulse' : 'border-line'
      }`}
    >
      <Icon size={18} className="text-ink-secondary" />
      <span
        className={`text-3xl font-bold leading-none transition-all duration-300 ${
          highlight ? 'scale-110 text-accent' : 'scale-100 text-ink'
        }`}
      >
        {value}
      </span>
      <span className="text-xs text-ink-secondary">{label}</span>
    </div>
  );
}

function StatsDashboard({ posts }: StatsDashboardProps) {
  const today = getToday();
  const currentMonthPrefix = today.slice(0, 7); // YYYY-MM

  const postsThisMonth = posts.filter((post) => post.data.startsWith(currentMonthPrefix));
  const daApprovare = posts.filter((post) => post.stato === 'bozza').length;
  const inPubblicazioneOggi = posts.filter((post) => post.data === today).length;
  const clientiAttivi = new Set(postsThisMonth.map((post) => post.cliente)).size;

  const stats = [
    {
      icon: CalendarDays,
      label: 'Post questo mese',
      value: postsThisMonth.length,
      alert: false,
    },
    {
      icon: PenLine,
      label: 'Da approvare',
      value: daApprovare,
      alert: false,
    },
    {
      icon: Send,
      label: 'In pubblicazione oggi',
      value: inPubblicazioneOggi,
      alert: inPubblicazioneOggi > 0,
    },
    {
      icon: Users,
      label: 'Clienti attivi',
      value: clientiAttivi,
      alert: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-12 px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-xs font-medium uppercase tracking-wide text-ink-secondary">
          Panoramica
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Aggiornato in tempo reale
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}

export default StatsDashboard;
