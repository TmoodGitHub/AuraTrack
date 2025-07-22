import { gql } from 'apollo-server-express';

export const authTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  extend type Mutation {
    createUser(email: String!, password: String!, role: String!): User!
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    promoteUserToAdmin(userId: ID!): Boolean!
    demoteAdminToUser(userId: ID!): Boolean!
    deleteUser(userId: ID!): Boolean!
  }

  extend type Query {
    users(limit: Int!, offset: Int!): [User]! # Non-nullable list of users
    userCount: Int! # Non-nullable user count (always returns an integer)
  }
`;
