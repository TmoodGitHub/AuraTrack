// src/graphql/resolvers/metrics.ts

import { AuthenticationError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import {
  getMetrics as fetchMetrics,
  createMetric as persistMetric,
} from '../../services/dynamoService';
import { PostgresService } from '../../services/postgresService';
import { GraphQLResolveInfo } from 'graphql';

interface Context {
  user?: { id: string };
}

export const metricsResolvers = {
  Query: {
    getMetrics: async (
      _parent: unknown,
      _args: Record<string, any>,
      { user }: Context,
      _info: GraphQLResolveInfo
    ) => {
      if (!user) throw new AuthenticationError('Authentication required');
      const records = await fetchMetrics(user.id);
      return records.map((item) => ({
        id: item.id,
        date: item.timestamp,
        sleepHours: item.sleepHours,
        mood: item.mood,
        energy: item.energy,
      }));
    },
  },

  Mutation: {
    createMetric: async (
      _parent: unknown,
      args: { date: string; sleepHours: number; mood: number; energy: number },
      { user }: Context,
      _info: GraphQLResolveInfo
    ) => {
      if (!user) throw new AuthenticationError('Authentication required');

      // Validate the provided date string
      const parsed = Date.parse(args.date);
      if (isNaN(parsed)) {
        throw new Error(
          'Invalid date format. Use YYYY-MM-DD or an ISO timestamp.'
        );
      }

      // Generate a UUID for the new metric
      const id = uuidv4();
      // Convert parsed date into an ISO timestamp
      const timestamp = new Date(parsed).toISOString();

      const newMetric = {
        id,
        userId: user.id,
        timestamp,
        mood: args.mood,
        energy: args.energy,
        sleepHours: args.sleepHours,
      };

      // Persist to DynamoDB and Postgres
      await persistMetric(newMetric);
      await PostgresService.logMetric(newMetric);

      // Return in the shape the schema expects
      return {
        id,
        date: timestamp,
        sleepHours: newMetric.sleepHours,
        mood: newMetric.mood,
        energy: newMetric.energy,
      };
    },
  },
};
