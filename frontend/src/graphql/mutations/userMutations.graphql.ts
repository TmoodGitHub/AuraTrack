import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        role
      }
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      user {
        email
      }
      token
    }
  }
`;

export const PROMOTE_USER_MUTATION = gql`
  mutation PromoteUser($userId: ID!) {
    promoteUser(userId: $userId) {
      id
      role
    }
  }
`;

export const DEMOTE_USER_MUTATION = gql`
  mutation DemoteUser($userId: ID!) {
    demoteUser(userId: $userId) {
      id
      role
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($email: String!, $password: String!, $role: String!) {
    createUser(email: $email, password: $password, role: $role) {
      id
      email
      role
    }
  }
`;
