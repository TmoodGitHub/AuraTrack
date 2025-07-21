import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import { signToken } from '../../middleware/auth';
import { PostgresService } from '../../services/postgresService';

interface Context {
  res: any;
}

export const authResolvers = {
  Mutation: {
    signup: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: Context
    ) => {
      const hashed = await bcrypt.hash(password, 12);

      const user = await PostgresService.createUser({
        email,
        password: hashed,
        role: 'user',
      });

      const token = signToken({ id: user.id, role: user.role });

      const days = parseInt(process.env.COOKIE_EXPIRES_IN || '90', 10);
      if (isNaN(days) || days < 0) {
        throw new Error('Invalid COOKIE_EXPIRES_IN env var');
      }
      const cookieMaxAge = days * 24 * 60 * 60 * 1000;

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: cookieMaxAge,
      });

      return { user, token };
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: Context
    ) => {
      const user = await PostgresService.findUserByEmail(email);
      if (!user) throw new AuthenticationError('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError('Invalid credentials');

      const token = signToken({ id: user.id, role: user.role });

      const days = parseInt(process.env.COOKIE_EXPIRES_IN || '90', 10);
      if (isNaN(days) || days < 0) {
        throw new Error('Invalid COOKIE_EXPIRES_IN env var');
      }
      const cookieMaxAge = days * 24 * 60 * 60 * 1000;

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: cookieMaxAge,
      });

      return { user, token };
    },
  },
};
