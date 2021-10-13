import {
  provideApolloClient, useQuery, useResult
} from '@vue/apollo-composable';
import { Loading } from 'quasar';
import { boot } from 'quasar/wrappers';
import { User } from 'src/entities';
import { QUERY_ME } from 'src/graphql/auth';
import { useStore } from 'src/stores/main';
import { apolloClient } from './graphql';

provideApolloClient(apolloClient);
export default boot(async () => {
  Loading.show();
  const token = localStorage.getItem('access_token');
  if (token) {
    const { onResult, result: res, onError } = useQuery(QUERY_ME);
    const result = await new Promise((resolve, reject) => {
      onResult(() => {
        resolve(res);
      });
      onError(() => {
        reject(null);
      });
    });
    if (result) {
      const user = useResult<User>(res).value;
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
