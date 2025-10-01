
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { type Employee, employees } from '@/lib/data';

const AUTH_STORAGE_KEY = 'unisync.auth.user';

type AuthContextType = {
  user: Employee | null;
  loading: boolean;
  login: (employeeId: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setUser(employee);
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(employee));
      router.push('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    router.push('/login');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
