import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { User } from 'src/entities';

export const useStore = defineStore('main', {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      access_token: useStorage<string | null>('access_token', null),
      loggedUser: null as User | null,
    };
  },
  getters: {
    isLoggedIn: (state) => state.access_token !== null,
    picture: (state) => {
      if (!state.loggedUser)
        return 'https://www.aaronandpartners.com/wp-content/uploads/blank-profile-picture-973460_640-1-e1599559219598-1.png';
      if (state.loggedUser.profile.picture) {
        return state.loggedUser.profile.picture;
      }
      return 'https://www.aaronandpartners.com/wp-content/uploads/blank-profile-picture-973460_640-1-e1599559219598-1.png';
    },
  },
  actions: {
    logout() {
      this.access_token = null;
      this.loggedUser = null;
    },
  },
});
