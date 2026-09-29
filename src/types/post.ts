export type ContentType = 'carosello' | 'reels' | 'statico';

export type PostStatus = 'bozza' | 'approvato' | 'pubblicato';

export interface Post {
  id: string;
  data: string; // formato YYYY-MM-DD
  tipo: ContentType;
  captions: string;
  orario: string;
  argomento: string;
  stato: PostStatus;
  cliente: string;
}
