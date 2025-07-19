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
      // 1. Hash the password
      const hashed = await bcrypt.hash(password, 12);

      // 2. Create user in Postgres
      const user = await PostgresService.createUser({
        email,
        password: hashed,
        role: 'user',
      });

      // 3. Issue JWT
      const token = signToken({ id: user.id, role: user.role });

      // 4. Compute cookie maxAge (days → ms)
      const days = parseInt(process.env.COOKIE_EXPIRES_IN || '90', 10);
      if (isNaN(days) || days < 0) {
        throw new Error('Invalid COOKIE_EXPIRES_IN env var');
      }
      const cookieMaxAge = days * 24 * 60 * 60 * 1000;

      // 5. Set HTTP-only cookie
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
      // 1. Find user
      const user = await PostgresService.findUserByEmail(email);
      if (!user) throw new AuthenticationError('Invalid credentials');

      // 2. Verify password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError('Invalid credentials');

      // 3. Issue JWT
      const token = signToken({ id: user.id, role: user.role });

      // 4. Compute cookie maxAge (days → ms)
      const days = parseInt(process.env.COOKIE_EXPIRES_IN || '90', 10);
      if (isNaN(days) || days < 0) {
        throw new Error('Invalid COOKIE_EXPIRES_IN env var');
      }
      const cookieMaxAge = days * 24 * 60 * 60 * 1000;

      // 5. Set HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: cookieMaxAge,
      });

      return { user, token };
    },
  },
};
