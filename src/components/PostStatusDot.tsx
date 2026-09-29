import { STATUS_DOT_BORDER, TYPE_COLORS } from '../lib/postDisplay';
import type { Post } from '../types/post';

function PostStatusDot({ post }: { post: Post }) {
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${TYPE_COLORS[post.tipo]} ${STATUS_DOT_BORDER[post.stato]}`}
    >
      {post.stato === 'pubblicato' && <span className="text-white text-[6px] leading-none">✓</span>}
    </span>
  );
}

export default PostStatusDot;
