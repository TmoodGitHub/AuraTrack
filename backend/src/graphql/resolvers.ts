// src/graphql/resolvers.ts
import { metricsResolvers } from './resolvers/metrics';
import { authResolvers } from './resolvers/auth';

export const resolvers = {
  Query: { ...metricsResolvers.Query },
  Mutation: { ...metricsResolvers.Mutation, ...authResolvers.Mutation },
};
