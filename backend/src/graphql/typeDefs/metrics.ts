import { gql } from 'apollo-server-express';

export const metricsTypeDefs = gql`
  type Metric {
    id: ID!
    date: String!
    sleepHours: Int
    mood: Int
    energy: Int
  }

  extend type Query {
    getMetrics: [Metric!]!
  }

  extend type Mutation {
    createMetric(
      date: String!
      sleepHours: Int
      mood: Int
      energy: Int
    ): Metric!
  }
`;
