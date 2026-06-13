import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const authData = response.data;
        setUser(authData);
        if (authData.token) {
          setToken(authData.token);
          localStorage.setItem('token', authData.token);
        }
        localStorage.setItem('user', JSON.stringify(authData));
        setIsLoading(false);
        return authData;
      }
      throw new Error(response.message || 'Error al iniciar sesión');
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        const authData = response.data;
        setUser(authData);
        if (authData.token) {
          setToken(authData.token);
          localStorage.setItem('token', authData.token);
        }
        localStorage.setItem('user', JSON.stringify(authData));
        setIsLoading(false);
        return authData;
      }
      throw new Error(response.message || 'Error al registrarse');
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.response?.data?.message || err.message || 'Error al registrarse';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'ADMIN',
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
