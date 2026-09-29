import type { Post } from '../types/post';

export const POSTS_KEY = 'ped.posts';
export const CLIENTI_KEY = 'ped.clienti';

export function loadPosts(): Post[] | null {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function loadClienti(): string[] | null {
  try {
    const raw = localStorage.getItem(CLIENTI_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveClienti(clienti: string[]): void {
  localStorage.setItem(CLIENTI_KEY, JSON.stringify(clienti));
}
