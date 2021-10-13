import gql from 'graphql-tag';

export const QUERY_POSTS = gql`
  query Posts {
    posts {
      id
      title
      src
      type
      likes {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

export const MUTATION_DELETE_POST = gql`
  mutation deletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;

export const MUTATION_LIKE_POST = gql`
  mutation likePost($postId: Int!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        name
      }
    }
  }
`;

export const MUTATION_CREATE_POST = gql`
  mutation createPost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
    }
  }
`;
