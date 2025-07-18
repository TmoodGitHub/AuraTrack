import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Metric {
    id: ID!
    date: String!
    sleepHours: Int
    mood: Int
    energy: Int
  }

  type Query {
    getMetrics: [Metric!]!
  }

  type Mutation {
    createMetric(
      date: String!
      sleepHours: Int
      mood: Int
      energy: Int
    ): Metric!
  }
`;
