import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
} from '../graphql/mutations/userMutations.graphql';

type UserRole = 'user' | 'admin';

type User = {
  id: string;
  email: string;
  role: UserRole;
} | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('auth_user');
      return null;
    }
  });
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  /**
   *
   * Login a user using email and password
   * Persist returning user info in context and localStorage
   *
   * @param email - user's email address
   * @param password  - user's plaintext password
   * @returns - the authenticated user object or null if failed
   */
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      const { user: newUser, token } = data.login as {
        user: User;
        token: string;
      };

      if (newUser) {
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        localStorage.setItem('auth_token', token);
      }
      return newUser;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  /**
   *
   * Sign up a new user with email, password
   * Persist returning user info in context and localStorage
   *
   * @param email - user's email address
   * @param password  - user's plaintext password
   * @returns - newly created user object or null if failed
   */
  const signup = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const { data } = await signupMutation({
        variables: { email, password },
      });
      const { user: newUser } = data.signup as {
        user: User;
      };

      if (newUser) {
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        return newUser;
      }
      return null;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  };

  /**
   * Logout current user by clearing out both context and localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Ensure component use this hook within the provider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};
