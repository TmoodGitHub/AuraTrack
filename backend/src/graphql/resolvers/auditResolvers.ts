import { AuthenticationError } from 'apollo-server-express';
import { PostgresService } from '../../services/postgresService';

export const auditResolvers = {
  Query: {
    getAuditLogs: async (
      _parent: any,
      args: { limit?: number; offset?: number },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      const limit = args.limit ?? 25;
      const offset = args.offset ?? 0;

      const logs = await PostgresService.getAuditLogs(limit, offset);
      return logs;
    },
  },
};
