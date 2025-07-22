import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($limit: Int!, $offset: Int!) {
    users(limit: $limit, offset: $offset) {
      id
      email
      role
    }
  }
`;

export const GET_USER_COUNT = gql`
  query GetUserCount {
    userCount
  }
`;
