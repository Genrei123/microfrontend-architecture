import { createContext, useContext, useState, type ReactNode } from 'react';
import { UserAPI, type User } from '../api/User';

const AUTH_SESSION_KEY = 'shopping-shell.authenticated-user';

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (user: User) => boolean;
  logout: () => void;
  user: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getSessionUser(): string {
  const username = sessionStorage.getItem(AUTH_SESSION_KEY);

  // A session is valid only when it was established after a successful login
  // and still refers to a known account.
  if (username && UserAPI.isAuthenticated(username)) {
    return username;
  }

  sessionStorage.removeItem(AUTH_SESSION_KEY);
  return '';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getSessionUser);

  const login = ({ username, password }: User) => {
    if (!UserAPI.login(username, password)) {
      return false;
    }

    // Keep only non-sensitive session identity. Passwords are never persisted.
    sessionStorage.setItem(AUTH_SESSION_KEY, username);
    setUser(username);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setUser('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// This module intentionally exposes the hook alongside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
