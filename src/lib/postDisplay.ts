import type { ContentType, Post, PostStatus } from '../types/post';

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export const WEEKDAY_LABELS_FULL = [
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
];

export const TYPE_COLORS: Record<ContentType, string> = {
  carosello: 'bg-purple-500',
  reels: 'bg-green-500',
  statico: 'bg-yellow-500',
};

export const TYPE_BORDER_COLORS: Record<ContentType, string> = {
  carosello: 'border-purple-500',
  reels: 'border-green-500',
  statico: 'border-yellow-500',
};

export const TYPE_LABELS: Record<ContentType, string> = {
  carosello: 'Carosello',
  reels: 'Reels',
  statico: 'Statico',
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  bozza: 'Bozza',
  approvato: 'Approvato',
  pubblicato: 'Pubblicato',
};

// Bordo del "pallino" nelle viste Mese/Settimana: il colore di riempimento resta quello del tipo,
// lo stato resta in scala di neri/grigi per non competere visivamente col colore del tipo.
export const STATUS_DOT_BORDER: Record<PostStatus, string> = {
  bozza: 'border border-dashed border-ink',
  approvato: 'border border-solid border-ink',
  pubblicato: 'border border-solid border-ink',
};

// Bordo della card estesa (Giorno / modale): lo stile del bordo (tratteggiato/pieno) indica lo
// stato, mentre il colore del bordo è quello del tipo (vedi TYPE_BORDER_COLORS) per farla risaltare.
export const STATUS_CARD_BORDER_STYLE: Record<PostStatus, string> = {
  bozza: 'border-dashed',
  approvato: 'border-solid',
  pubblicato: 'border-solid',
};

// Bordo della cella giorno in MonthCalendar: colore in base allo stato "più urgente" tra i post
// del giorno (bozza > approvato > pubblicato), per segnalare l'avanzamento del lavoro a colpo d'occhio.
export const STATUS_PRIORITY_BORDER: Record<PostStatus, string> = {
  bozza: 'border-red-500',
  approvato: 'border-yellow-500',
  pubblicato: 'border-green-500',
};

export function getDayStatusBorder(dayPosts: Post[]): string {
  if (dayPosts.length === 0) {
    return 'border-line';
  }
  if (dayPosts.some((post) => post.stato === 'bozza')) {
    return STATUS_PRIORITY_BORDER.bozza;
  }
  if (dayPosts.some((post) => post.stato === 'approvato')) {
    return STATUS_PRIORITY_BORDER.approvato;
  }
  return STATUS_PRIORITY_BORDER.pubblicato;
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getToday(): string {
  const now = new Date();
  return toDateString(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(dateStr: string, delta: number): string {
  const { year, month, day } = parseDate(dateStr);
  const date = new Date(year, month - 1, day + delta);
  return toDateString(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addWeeks(dateStr: string, delta: number): string {
  return addDays(dateStr, delta * 7);
}

export function addMonths(dateStr: string, delta: number): string {
  const { year, month, day } = parseDate(dateStr);
  const target = new Date(year, month - 1 + delta, 1);
  const lastDayOfTarget = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return toDateString(target.getFullYear(), target.getMonth(), Math.min(day, lastDayOfTarget));
}

export function formatDateLabel(dateStr: string): string {
  const { year, month, day } = parseDate(dateStr);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getMonthLabel(dateStr: string): string {
  const { year, month } = parseDate(dateStr);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
}

export function getWeekLabel(dateStr: string): string {
  const [startStr, endStr] = [getWeekDates(dateStr)[0], getWeekDates(dateStr)[6]];
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const monthStart = new Date(start.year, start.month - 1, 1).toLocaleDateString('it-IT', {
    month: 'long',
  });
  const monthEnd = new Date(end.year, end.month - 1, 1).toLocaleDateString('it-IT', {
    month: 'long',
  });

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}-${end.day} ${monthStart} ${start.year}`;
  }
  if (start.year === end.year) {
    return `${start.day} ${monthStart} - ${end.day} ${monthEnd} ${start.year}`;
  }
  return `${start.day} ${monthStart} ${start.year} - ${end.day} ${monthEnd} ${end.year}`;
}

export function getWeekDates(dateStr: string): string[] {
  const { year, month, day } = parseDate(dateStr);
  const weekday = (new Date(year, month - 1, day).getDay() + 6) % 7; // 0 = lunedì
  const monday = new Date(year, month - 1, day - weekday);

  return Array.from({ length: 7 }, (_, i) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    return toDateString(current.getFullYear(), current.getMonth(), current.getDate());
  });
}
