import { AuthenticationError } from 'apollo-server-express';
import { PostgresService } from '../../services/postgresService';
import { convertToCSV } from '../../utils/csvUtils';

export const auditResolvers = {
  Query: {
    getAuditLogs: async (
      _parent: any,
      args: {
        limit?: number;
        offset?: number;
        action?: 'PROMOTE_TO_ADMIN' | 'DEMOTE_TO_USER' | 'DELETE_USER';
        adminEmail?: string;
      },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      const { limit = 25, offset = 0, action, adminEmail } = args;

      const logs = await PostgresService.getAuditLogs(
        limit,
        offset,
        action,
        adminEmail
      );
      return logs;
    },

    getAuditLogCount: async (
      _parent: any,
      args: { action?: string; adminEmail?: string },
      context: any
    ): Promise<number> => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      return PostgresService.getAuditLogCount(args.action, args.adminEmail);
    },

    exportAuditLogs: async (
      _parent: any,
      args: { action?: string; adminEmail?: string },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      const logs = await PostgresService.getAuditLogsForCSV(
        args.action,
        args.adminEmail
      );

      const fields = [
        'timestamp',
        'action',
        'admin_email',
        'target_email',
        'details',
      ];
      return convertToCSV(logs, fields);
    },

    getAuditActionCountsPerAdmin: async (
      _parent: any,
      _args: any,
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      return PostgresService.getAuditActionCountsPerAdmin();
    },
  },
};
