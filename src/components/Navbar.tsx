import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo + Nome brand */}
          <Link to="/" className="flex items-center gap-2">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-base font-semibold">Serrau Edilizia</span>
        </Link>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          {user.role === 'admin' && (
            <>
              <Link to="/scannerizza" className="hover:text-yellow-300">Scannerizza</Link>
              <Link to="/prodotti" className="hover:text-yellow-300">Prodotti</Link>
              <Link to="/fatture" className="hover:text-yellow-300">Fatture</Link>
            </>
          )}
        <span className="text-sm italic hidden md:inline">
          {['sara', 'serena', 'silvia'].includes(user.username.toLowerCase())
            ? user.isReturning ? 'Bentornata' : 'Benvenuta'
            : user.isReturning ? 'Bentornato' : 'Benvenuto'} {user.username}
        </span>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2">
          {user.role === 'admin' && (
            <>
              <Link to="/scannerizza" className="hover:text-yellow-300">Scannerizza</Link>
              <Link to="/prodotti" className="hover:text-yellow-300">Prodotti</Link>
              <Link to="/fatture" className="hover:text-yellow-300">Fatture</Link>
            </>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
