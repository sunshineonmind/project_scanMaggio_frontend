import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  role: string;
}

interface JwtPayload {
  exp: number;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: { username: string; role: string; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.exp * 1000 > Date.now()) {
          setUser({ username: decoded.username, role: decoded.role });
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Errore nel parsing del token:', error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: { username: string; role: string; token: string }) => {
    localStorage.setItem('token', userData.token);
    setUser({ username: userData.username, role: userData.role });
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
