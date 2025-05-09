import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

interface User {
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
  const [loading, setLoading] = useState(true); // Nuovo stato di caricamento

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      try {
        const decoded: any = jwt_decode(token);

        if (decoded.exp * 1000 > Date.now()) {
          setUser({ username, role });
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Errore nel parsing del token:', error);
        logout();
      }
    }
    setLoading(false); // Indica che il caricamento è completo
  }, []);

  const login = (userData: { username: string; role: string; token: string }) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('role', userData.role);
    setUser({ username: userData.username, role: userData.role });
    setIsAuthenticated(true);
    setLoading(false); // Caricamento completato
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
