import { gql } from '@urql/vue';

export const QUERY_USERS = gql`
  query Users {
    users {
      id
      name
    }
  }
`;
