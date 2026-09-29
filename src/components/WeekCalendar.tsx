import {
  WEEKDAY_LABELS_FULL,
  getWeekDates,
  addWeeks,
  getDayStatusBorder,
  getWeekLabel,
  getToday,
} from '../lib/postDisplay';
import type { Post } from '../types/post';
import CalendarNav from './CalendarNav';
import PostStatusDot from './PostStatusDot';
import StatusLegend from './StatusLegend';

interface WeekCalendarProps {
  currentDate: string;
  posts: Post[];
  hasActiveFilters: boolean;
  selectedDate: string | null;
  onNavigate: (date: string) => void;
  onSelectDate: (date: string) => void;
}

function WeekCalendar({
  currentDate,
  posts,
  hasActiveFilters,
  selectedDate,
  onNavigate,
  onSelectDate,
}: WeekCalendarProps) {
  const weekDates = getWeekDates(currentDate);
  const today = getToday();

  const postsByDate = new Map<string, Post[]>();
  for (const post of posts) {
    const list = postsByDate.get(post.data) ?? [];
    list.push(post);
    postsByDate.set(post.data, list);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <CalendarNav
        label={getWeekLabel(currentDate)}
        onPrev={() => onNavigate(addWeeks(currentDate, -1))}
        onNext={() => onNavigate(addWeeks(currentDate, 1))}
        onToday={() => onNavigate(today)}
      />

      {hasActiveFilters && posts.length === 0 && (
        <p className="text-center text-sm text-ink-secondary mb-4">
          Nessun contenuto trovato con i filtri attuali.
        </p>
      )}

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((dateStr, i) => {
          const dayPosts = postsByDate.get(dateStr) ?? [];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const statusBorder = getDayStatusBorder(dayPosts);
          const day = Number(dateStr.split('-')[2]);

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-h-24 border-2 rounded-sm p-2 flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-surface ${statusBorder} ${
                isToday ? 'bg-surface' : ''
              } ${isSelected ? 'ring-2 ring-ink ring-offset-1' : ''}`}
            >
              <span className="text-xs font-medium text-ink-secondary text-center">
                {WEEKDAY_LABELS_FULL[i]}
              </span>
              <span className="text-sm mt-0.5">{day}</span>
              <div className="flex gap-0.5 mt-2 flex-wrap justify-center">
                {dayPosts.map((post) => (
                  <PostStatusDot key={post.id} post={post} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <StatusLegend />
    </div>
  );
}

export default WeekCalendar;
