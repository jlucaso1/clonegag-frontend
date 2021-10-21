import { gql } from '@urql/vue';

export const QUERY_USERS = gql`
  query Users {
    users {
      id
      name
    }
  }
`;
export const QUERY_USER = gql`
  query User($userId: Int!) {
    user(userId: $userId) {
      id
      name
      email
      profile {
        id
        bio
        picture
      }
    }
  }
`;

export const MUTATION_EDIT_USER = gql`
  mutation editUser($updateUserInput: UpdateUserInput!) {
    editUser(updateUserInput: $updateUserInput) {
      id
      name
      email
      profile {
        bio
        picture
      }
    }
  }
`;

export const MUTATION_DELETE_ME = gql`
  mutation deleteMe {
    deleteMe {
      id
      name
    }
  }
`;
