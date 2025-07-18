import { IResolvers } from '@graphql-tools/utils';
import { DynamoService } from '../services/dynamoService';
import { PostgresService } from '../services/postgresService';

export const resolvers: IResolvers = {
  Query: {
    getMetrics: async () => {
      return await DynamoService.getMetrics();
    },
  },
  Mutation: {
    createMetric: async (_: any, args: any) => {
      const newMetric = await DynamoService.createMetric(args);
      await PostgresService.logMetric(newMetric);
      return newMetric;
    },
  },
};
