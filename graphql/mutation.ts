import { gql } from '@apollo/client';

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      id
      created_at
      body
      image
      subreddit_id
      title
      username
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $text: String!, $username: String!) {
    insertComment(post_id: $postID, text: $text, username: $username) {
      created_at
      id
      post_id
      text
      username
    }
  }
`;
