import { Loading, Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { User } from 'src/entities';
import { QUERY_ME } from 'src/graphql/auth';
import { useStore } from 'src/stores/main';
import { useRouter } from 'vue-router';
import { gqlClient } from './graphql';

type ResponseMe = {
  me: User;
};

export default boot(async () => {
  Loading.show();
  const token = localStorage.getItem('access_token');
  if (token) {
    const { data, error } = await gqlClient
      .query<ResponseMe>(QUERY_ME)
      .toPromise();
    if (error) {
      const router = useRouter();
      Notify.create({
        message: error.message,
        color: 'negative',
      });
      localStorage.removeItem('access_token');
      await router.push('/login');
      return;
    }
    if (data) {
      const user = data.me;
      if (user) {
        const store = useStore();
        store.loggedUser = user;
      }
    } else {
      localStorage.removeItem('access_token');
    }
  }
  Loading.hide();
});
