import { defineStore } from 'pinia';
import { Post, User } from 'src/entities';
import { useStorage } from '@vueuse/core';
import { useQuery, useResult } from '@vue/apollo-composable';
import { QUERY_POSTS } from 'src/graphql/post';

export const useStore = defineStore('main', {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      access_token: useStorage<string | null>('access_token', null),
      loggedUser: null as User | null,
      posts: [] as Post[],
    };
  },
  getters: {
    isLoggedIn: (state) => state.access_token !== null,
  },
  actions: {
    logout() {
      this.access_token = null;
      this.loggedUser = null;
    },
    async fetchPosts() {
      const { result, onResult, onError } = useQuery(QUERY_POSTS);
      await new Promise((resolve, reject) => {
        onResult(() => {
          this.posts = useResult<Post[]>(result).value as Post[];
          resolve(this.posts);
        });
        onError(() => {
          reject({ message: 'Error fetching posts' });
        });
      });
    },
    deletePost(postId: number) {
      this.posts = this.posts.filter((post) => post.id !== postId);
    },
    updatePostLikes(postId: number, post: Post) {
      this.posts = this.posts.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: post.likes };
        }
        return p;
      });
    },
  },
});
