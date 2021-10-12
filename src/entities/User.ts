import { Post } from './Post';

export type User = {
  id: number;

  name: string;

  email: string;

  posts: Post[];

  profile: {
    id: number;
    bio?: string;
    picture?: string;
  };
};
