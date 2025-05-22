import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  role: string;
  token: string;
  isReturning?: boolean;
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
  login: (userData: User) => void; // <-- ora accetta tutto incluso isReturning
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
          setUser({ username: decoded.username, role: decoded.role, token });
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

  const login = (userData: User) => {
    localStorage.setItem('token', userData.token);
    setUser(userData); // ⬅️ salva anche isReturning se presente
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
