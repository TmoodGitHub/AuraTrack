import { IResolvers } from '@graphql-tools/utils';
import { getMetrics, createMetric } from '../services/dynamoService';
import { PostgresService } from '../services/postgresService';

export const resolvers: IResolvers = {
  Query: {
    getMetrics: async (_: any, args: { userId: string }) => {
      return await getMetrics(args.userId);
    },
  },
  Mutation: {
    createMetric: async (_: any, args: any) => {
      const newMetric = await createMetric({
        userId: 'tamer123',
        timestamp: args.date,
        mood: args.mood,
        energy: args.energy,
        sleepHours: args.sleepHours,
      });

      await PostgresService.logMetric(newMetric);

      return {
        id: newMetric.id,
        date: newMetric.timestamp,
        mood: newMetric.mood,
        energy: newMetric.energy,
        sleepHours: newMetric.sleepHours,
      };
    },
  },
};
