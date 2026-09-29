import { useEffect, useState } from 'react';
import {
  STATUS_CARD_BORDER_STYLE,
  STATUS_LABELS,
  TYPE_BORDER_COLORS,
  TYPE_COLORS,
  TYPE_LABELS,
  formatDateLabel,
} from '../lib/postDisplay';
import type { Post, PostStatus } from '../types/post';

const STATUSES: PostStatus[] = ['bozza', 'approvato', 'pubblicato'];

interface PostCardProps {
  post: Post;
  onUpdateStatus: (postId: string, nuovoStato: PostStatus) => void;
}

export function PostCard({ post, onUpdateStatus }: PostCardProps) {
  return (
    <div
      className={`rounded-sm p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md border-2 ${STATUS_CARD_BORDER_STYLE[post.stato]} ${TYPE_BORDER_COLORS[post.tipo]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-medium text-ink px-2 py-0.5 rounded-sm ${TYPE_COLORS[post.tipo]}`}
        >
          {TYPE_LABELS[post.tipo]}
        </span>
        <span className="text-sm text-ink-secondary">{post.orario}</span>
      </div>
      <p className="text-lg font-semibold leading-relaxed mb-1">{post.argomento}</p>
      <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-wrap mb-3">
        {post.captions}
      </p>
      <div className="flex items-center justify-between text-xs text-ink-secondary pt-2 border-t border-line">
        <span>{post.cliente}</span>
        <span className="flex items-center gap-1.5">
          <select
            value={post.stato}
            onChange={(e) => onUpdateStatus(post.id, e.target.value as PostStatus)}
            className="text-xs font-medium text-ink-secondary bg-paper border border-line rounded-sm px-1.5 py-0.5 cursor-pointer hover:border-ink focus:outline-none focus:border-ink"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {post.stato === 'pubblicato' && <span className="text-ink">✓</span>}
        </span>
      </div>
    </div>
  );
}

interface PostDetailModalProps {
  date: string;
  posts: Post[];
  onClose: () => void;
  onCreatePost: () => void;
  onUpdateStatus: (postId: string, nuovoStato: PostStatus) => void;
}

function PostDetailModal({
  date,
  posts,
  onClose,
  onCreatePost,
  onUpdateStatus,
}: PostDetailModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 px-4 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-paper border border-ink rounded-sm w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 relative transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
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

        <h3 className="text-3xl font-bold mb-5 capitalize">{formatDateLabel(date)}</h3>

        {posts.length === 0 ? (
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdateStatus={onUpdateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetailModal;
