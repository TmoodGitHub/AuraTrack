import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type UserRole = 'user' | 'admin';
type User = {
  email: string;
  role: UserRole;
} | null;

interface AuthContextType {
  user: User;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    let newUser: User | null = null;

    if (email === 'admin@example.com' && password === 'admin123') {
      newUser = { email, role: 'admin' };
    } else if (email === 'user@example.com' && password === 'user123') {
      newUser = { email, role: 'user' };
    }

    if (newUser) {
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }

    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ensure component use this hook within the provider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};
