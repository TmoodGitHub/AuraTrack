import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { PostgresService } from '../../services/postgresService';

export const adminResolvers = {
  Mutation: {
    promoteUserToAdmin: async (
      _: any,
      { userId }: { userId: string },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      if (context.user.id === userId) {
        throw new UserInputError('Admins cannot promote themselves');
      }

      await PostgresService.promoteUser(userId);

      await PostgresService.logAuditAction({
        adminId: context.user.id,
        action: 'PROMOTE_TO_ADMIN',
        targetId: userId,
        details: `Admin ${context.user.email} (${context.user.id}) promoted user ${userId} to admin`,
      });

      return true;
    },

    demoteAdminToUser: async (
      _: any,
      { userId }: { userId: string },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      if (context.user.id === userId) {
        throw new UserInputError('Admins cannot demote themselves');
      }

      const isMasterAdmin = await PostgresService.isMasterAdmin(userId);
      if (isMasterAdmin) {
        throw new UserInputError('Cannot demote master admin');
      }

      await PostgresService.demoteUser(userId);

      await PostgresService.logAuditAction({
        adminId: context.user.id,
        action: 'DEMOTE_TO_USER',
        targetId: userId,
        details: `Admin ${context.user.email} (${context.user.id}) demoted user ${userId} to regular user`,
      });

      return true;
    },

    deleteUser: async (
      _: any,
      { userId }: { userId: string },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      if (context.user.id === userId) {
        throw new UserInputError('Admins cannot delete themselves');
      }

      const isMasterAdmin = await PostgresService.isMasterAdmin(userId);
      if (isMasterAdmin) {
        throw new UserInputError('Cannot delete master admin');
      }

      await PostgresService.logAuditAction({
        adminId: context.user.id,
        action: 'DELETE_USER',
        targetId: userId,
        details: `Admin ${context.user.email} (${context.user.id}) deleted user ${userId}`,
      });

      await PostgresService.deleteUser(userId);
      return true;
    },
  },
};
