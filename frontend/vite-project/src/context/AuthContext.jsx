import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DASHBOARD_BY_ROLE, normalizeRole } from '../constants/roles.js';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

const USER_KEY = 'vetcare_user';

/* ---------- Provider ---------- */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount + verify with backend */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const cached = localStorage.getItem(USER_KEY);
        if (cached) setUser(JSON.parse(cached));

        /* Verify token is still valid */
        const fresh = await authService.me();
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      } catch (err) {
        /* Token invalid or no session — clear and stay logged out */
        authService.logout();
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const persist = (userData) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  /* ---------- REGISTER ---------- */
  const register = useCallback(async (payload) => {
    const userData = await authService.register(payload);
    persist(userData);
    return userData;
  }, []);

  /* ---------- LOGIN ---------- */
  const login = useCallback(async (credentials) => {
    const userData = await authService.login(credentials);
    persist(userData);
    return userData;
  }, []);

  /* ---------- LOGOUT ---------- */
  const logout = useCallback(() => {
    authService.logout();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const dashboardPath = user
    ? DASHBOARD_BY_ROLE[normalizeRole(user.role)] || '/login'
    : '/login';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        dashboardPath,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}