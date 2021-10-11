import { User } from './User';

export type Post = {
  id: number;

  title: string;

  src: string;

  type: string;

  user: User;

  likes: Partial<User>[];
};
