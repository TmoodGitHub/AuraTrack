import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type UserRole = 'user' | 'admin';
type User = {
  email: string;
  role: UserRole;
} | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const login = async (email: string, password: string) => {
    if (email === 'admin@example.com' && password === 'admin') {
      setUser({ email, role: 'admin' });
      return true;
    } else if (email === 'user@example.com' && password === 'user') {
      setUser({ email, role: 'user' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
