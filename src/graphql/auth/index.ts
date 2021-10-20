import { gql } from '@urql/vue';

export const MUTATION_LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        name
        email
        profile {
          picture
        }
      }
    }
  }
`;
export const MUTATION_REGISTER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerUserInput: $registerInput) {
      access_token
      user {
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
  }
`;

export const QUERY_ME = gql`
  query Me {
    me {
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
