import {
  TYPE_COLORS,
  TYPE_LABELS,
  WEEKDAY_LABELS,
  toDateString,
  addMonths,
  getDayStatusBorder,
  getMonthLabel,
  getToday,
} from '../lib/postDisplay';
import type { ContentType, Post } from '../types/post';
import CalendarNav from './CalendarNav';
import PostStatusDot from './PostStatusDot';
import StatusLegend from './StatusLegend';

interface MonthCalendarProps {
  currentDate: string;
  posts: Post[];
  hasActiveFilters: boolean;
  selectedDate: string | null;
  onNavigate: (date: string) => void;
  onSelectDate: (date: string) => void;
}

function MonthCalendar({
  currentDate,
  posts,
  hasActiveFilters,
  selectedDate,
  onNavigate,
  onSelectDate,
}: MonthCalendarProps) {
  const [year, month] = currentDate.split('-').map(Number);
  const monthIndex = month - 1;
  const today = getToday();

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7; // 0 = lunedì

  const postsByDate = new Map<string, Post[]>();
  for (const post of posts) {
    const list = postsByDate.get(post.data) ?? [];
    list.push(post);
    postsByDate.set(post.data, list);
  }

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <CalendarNav
        label={getMonthLabel(currentDate)}
        onPrev={() => onNavigate(addMonths(currentDate, -1))}
        onNext={() => onNavigate(addMonths(currentDate, 1))}
        onToday={() => onNavigate(today)}
      />

      {hasActiveFilters && posts.length === 0 && (
        <p className="text-center text-sm text-ink-secondary mb-4">
          Nessun contenuto trovato con i filtri attuali.
        </p>
      )}

      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-sm font-medium text-ink-secondary py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = toDateString(year, monthIndex, day);
          const dayPosts = postsByDate.get(dateStr) ?? [];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const statusBorder = getDayStatusBorder(dayPosts);

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square border-2 rounded-sm p-1 flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-surface ${statusBorder} ${
                isToday ? 'bg-surface' : ''
              } ${isSelected ? 'ring-2 ring-ink ring-offset-1' : ''}`}
            >
              <span className="text-sm">{day}</span>
              <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                {dayPosts.map((post) => (
                  <PostStatusDot key={post.id} post={post} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center mt-8">
        {(Object.keys(TYPE_COLORS) as ContentType[]).map((tipo) => (
          <div key={tipo} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[tipo]}`} />
            <span className="text-sm text-ink-secondary">{TYPE_LABELS[tipo]}</span>
          </div>
        ))}
      </div>

      <StatusLegend />

      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-ink-secondary">
        <span className="font-medium text-ink">Stato del post:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-paper border border-dashed border-ink" />
          <span>Bozza</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-paper border border-solid border-ink" />
          <span>Approvato</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-paper border border-solid border-ink flex items-center justify-center">
            <span className="text-[6px] leading-none text-ink">✓</span>
          </span>
          <span>Pubblicato</span>
        </div>
      </div>
    </div>
  );
}

export default MonthCalendar;
