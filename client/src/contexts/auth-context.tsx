import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export type UserMode = 'guest' | 'member';

interface AuthContextType {
  user: User | null;
  userMode: UserMode;
  isGuest: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserMode: (mode: UserMode) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userMode, setUserMode] = useState<UserMode>('guest');
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/auth/user');
      const userData = await response.json();
      
      if (response.ok && userData) {
        setUser(userData);
        setUserMode('member');
        localStorage.setItem('flashtastic-user', JSON.stringify(userData));
        localStorage.setItem('flashtastic-mode', 'member');
      } else {
        // Check for saved guest mode
        const savedMode = localStorage.getItem('flashtastic-mode') as UserMode;
        if (savedMode === 'guest') {
          setUserMode('guest');
        }
      }
    } catch (error) {
      // If not authenticated, check for guest mode
      const savedMode = localStorage.getItem('flashtastic-mode') as UserMode;
      if (savedMode === 'guest') {
        setUserMode('guest');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setUserMode('member');
    localStorage.setItem('flashtastic-user', JSON.stringify(userData));
    localStorage.setItem('flashtastic-mode', 'member');
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserMode('guest');
      localStorage.removeItem('flashtastic-user');
      localStorage.removeItem('flashtastic-mode');
    }
  };

  const continueAsGuest = () => {
    setUserMode('guest');
    setUser(null);
    localStorage.setItem('flashtastic-mode', 'guest');
  };

  const value: AuthContextType = {
    user,
    userMode,
    isGuest: userMode === 'guest',
    isAuthenticated: !!user && userMode === 'member',
    isLoading,
    setUserMode,
    login,
    logout,
    continueAsGuest,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Guest user data for display purposes (no persistence)
export const createGuestUser = (grade: string = '2'): User => ({
  id: 'guest',
  username: 'guest_user',
  name: 'Guest Student',
  grade,
  avatar: '1',
  points: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  settings: {},
  createdAt: new Date()
});