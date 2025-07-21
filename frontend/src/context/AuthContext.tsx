import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';

type UserRole = 'user' | 'admin';

type User = {
  id: string;
  email: string;
  role: UserRole;
} | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });
  const [loginMutation] = useMutation(LOGIN_MUTATION);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Ensure component use this hook within the provider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};
