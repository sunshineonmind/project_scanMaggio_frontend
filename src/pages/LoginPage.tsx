import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  const handleLogin = async () => {
    console.log("login....");
    console.log("Chiamo login su:", `${apiUrl}/auth/login`);
    setErrore('');

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrore(data.error || 'Credenziali non valide');
        return;
      }

      // Salva il token nel localStorage
      localStorage.setItem('token', data.token);

      // Passa tutti i dati richiesti dal contesto
      login({
        username: data.username,
        role: data.role,
        token: data.token,
        isReturning: data.isReturning // opzionale
      });

      // Redirect in base al ruolo
      navigate(data.role === 'admin' ? '/' : '/guest');
    } catch (err) {
      console.error('Errore login:', err);
      setErrore('Errore di connessione al server');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Accedi
        </button>

        {errore && <p className="text-red-500 mt-3 text-center">{errore}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
