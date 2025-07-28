import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@shared/schema';

export type UserMode = 'guest' | 'member';

interface AuthContextType {
  user: User | null;
  userMode: UserMode;
  isGuest: boolean;
  setUserMode: (mode: UserMode) => void;
  login: (user: User) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userMode, setUserMode] = useState<UserMode>('guest');

  useEffect(() => {
    // Check for saved user data on app start
    const savedUser = localStorage.getItem('flashkademy-user');
    const savedMode = localStorage.getItem('flashkademy-mode') as UserMode;
    
    if (savedUser && savedMode === 'member') {
      try {
        setUser(JSON.parse(savedUser));
        setUserMode('member');
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('flashkademy-user');
        localStorage.removeItem('flashkademy-mode');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setUserMode('member');
    localStorage.setItem('flashkademy-user', JSON.stringify(userData));
    localStorage.setItem('flashkademy-mode', 'member');
  };

  const logout = () => {
    setUser(null);
    setUserMode('guest');
    localStorage.removeItem('flashkademy-user');
    localStorage.removeItem('flashkademy-mode');
  };

  const continueAsGuest = () => {
    setUserMode('guest');
    setUser(null);
    localStorage.setItem('flashkademy-mode', 'guest');
  };

  const value: AuthContextType = {
    user,
    userMode,
    isGuest: userMode === 'guest',
    setUserMode,
    login,
    logout,
    continueAsGuest
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