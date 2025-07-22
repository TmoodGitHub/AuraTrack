import { metricsResolvers } from './resolvers/metricsResolvers';
import { authResolvers } from './resolvers/authResolvers';
import { adminResolvers } from './resolvers/adminResolvers';
import { auditResolvers } from './resolvers/auditResolvers';

export const resolvers = {
  Query: {
    ...metricsResolvers.Query,
    ...auditResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...metricsResolvers.Mutation,
    ...authResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
};
