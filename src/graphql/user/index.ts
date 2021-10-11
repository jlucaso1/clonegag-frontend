import gql from 'graphql-tag';

export const QUERY_USERS = gql`
  query Users {
    users {
      id
      name
    }
  }
`;
