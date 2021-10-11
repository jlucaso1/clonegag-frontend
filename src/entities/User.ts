import { Post } from './Post';

export type User = {
  id: number;

  name: string;

  email: string;

  posts: Post[];
};
