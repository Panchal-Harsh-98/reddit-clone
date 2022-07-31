import { gql } from '@apollo/client';

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const GET_ALL_POST = gql`
  query MyQuery {
    getPostList {
      image
      body
      id
      username
      title
      subreddit_id
      created_at
      subreddit {
        topic
        id
        created_at
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      comments {
        id
        post_id
        text
        username
        created_at
      }
    }
  }
`;
