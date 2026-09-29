import { formatDateLabel, addDays, getToday, STATUS_PRIORITY_BORDER } from '../lib/postDisplay';
import { PostCard } from './PostDetailModal';
import CalendarNav from './CalendarNav';
import StatusLegend from './StatusLegend';
import type { Post, PostStatus } from '../types/post';

interface DayViewProps {
  currentDate: string;
  posts: Post[];
  onNavigate: (date: string) => void;
  onCreatePost: () => void;
  onUpdateStatus: (postId: string, nuovoStato: PostStatus) => void;
}

function DayView({ currentDate, posts, onNavigate, onCreatePost, onUpdateStatus }: DayViewProps) {
  const dayPosts = posts.filter((post) => post.data === currentDate);

  return (
    <div className="max-w-xl mx-auto p-8">
      <CalendarNav
        label={formatDateLabel(currentDate)}
        onPrev={() => onNavigate(addDays(currentDate, -1))}
        onNext={() => onNavigate(addDays(currentDate, 1))}
        onToday={() => onNavigate(getToday())}
      />

      {dayPosts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-ink-secondary mb-4">
            Ancora nessun contenuto qui. Che ne dici di pianificarne uno?
          </p>
          <button
            type="button"
            onClick={onCreatePost}
            className="px-5 py-2 text-sm font-medium rounded-sm bg-ink text-white hover:bg-ink-secondary active:scale-95 transition-transform"
          >
            + Pianifica un post
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {dayPosts.map((post) => (
            <div key={post.id} className={`border-l-4 ${STATUS_PRIORITY_BORDER[post.stato]}`}>
              <PostCard post={post} onUpdateStatus={onUpdateStatus} />
            </div>
          ))}
        </div>
      )}

      <StatusLegend />
    </div>
  );
}

export default DayView;
