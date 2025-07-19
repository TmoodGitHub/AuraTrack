import { gql } from 'apollo-server-express';

export const authTypeDefs = gql`
  extend type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }

  type User {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }
`;
