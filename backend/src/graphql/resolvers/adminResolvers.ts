import {
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';
import { PostgresService } from '../../services/postgresService';

export const adminResolvers = {
  Query: {
    // Resolver for the users query with pagination
    users: async (
      _: any,
      { limit, offset }: { limit: number; offset: number },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      try {
        // Fetch users with pagination
        const users = await PostgresService.getUsers(
          limit,
          offset
        ); // Modify the PostgresService to support this
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Unable to fetch users');
      }
    },

    // Resolver for userCount
    userCount: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      try {
        const count = PostgresService.getUserCount();
        // Ensure that count is always a valid number
        return count || 0; // If the count is invalid, return 0
      } catch (error) {
        console.error(
          'Error resolve fetching user count:',
          error
        );
        return 0; // Return 0 if there's an error
      }
    },
  },

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
        throw new UserInputError(
          'Admins cannot promote themselves'
        );
      }

      const updatedUser = await PostgresService.promoteUser(
        userId
      ); // Ensure you return the updated user here

      await PostgresService.logAuditAction({
        adminId: context.user.id,
        action: 'PROMOTE_TO_ADMIN',
        targetId: userId,
        details: `Admin ${context.user.email} (${context.user.id}) promoted user ${userId} to admin`,
      });

      return updatedUser; // Return the updated user data here
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
        throw new UserInputError(
          'Admins cannot demote themselves'
        );
      }

      const isMasterAdmin =
        await PostgresService.isMasterAdmin(userId);
      if (isMasterAdmin) {
        throw new UserInputError(
          'Cannot demote master admin'
        );
      }

      const updatedUser = await PostgresService.demoteUser(
        userId
      ); // Ensure you return the updated user here

      await PostgresService.logAuditAction({
        adminId: context.user.id,
        action: 'DEMOTE_TO_USER',
        targetId: userId,
        details: `Admin ${context.user.email} (${context.user.id}) demoted user ${userId} to regular user`,
      });

      return updatedUser; // Return the updated user data here
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
        throw new UserInputError(
          'Admins cannot delete themselves'
        );
      }

      const isMasterAdmin =
        await PostgresService.isMasterAdmin(userId);
      if (isMasterAdmin) {
        throw new UserInputError(
          'Cannot delete master admin'
        );
      }

      await PostgresService.logAuditAction({
        adminId: context.user.id,
        action: 'DELETE_USER',
        targetId: userId,
        details: `Admin ${context.user.email} (${context.user.id}) deleted user ${userId}`,
      });

      await PostgresService.deleteUser(userId); // Ensure you return the deleted user here

      return true; // Return the deleted user data here
    },

    createUser: async (
      _: any,
      {
        email,
        password,
        role,
      }: { email: string; password: string; role: string },
      context: any
    ) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Access denied');
      }

      try {
        // Ensure the user is created and returned from PostgresService
        const newUser = await PostgresService.createUser(
          {
            email,
            password,
            role,
          },
          true
        );

        if (newUser) {
          return newUser; // Return the created user to the client
        } else {
          throw new Error('User creation failed');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Unable to create user');
      }
    },
  },
};
