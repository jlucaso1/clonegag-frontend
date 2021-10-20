import urql, { createClient } from '@urql/vue';
import { boot } from 'quasar/wrappers';


const gqlClient = createClient({
  url: process.env.DEV
    ? 'http://localhost:3000/graphql'
    : 'https://clonegag.herokuapp.com/graphql',
  fetchOptions: () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

export default boot(({ app }) => {
  app.use(urql, gqlClient);
});

export { gqlClient };
