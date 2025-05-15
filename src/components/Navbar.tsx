import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        {user.role === 'admin' && (
          <>
            <Link to="/scannerizza" className="hover:text-yellow-300">Scannerizza</Link>
            <Link to="/prodotti" className="hover:text-yellow-300">Prodotti</Link>
            <Link to="/fatture" className="hover:text-yellow-300">Fatture</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm italic">Benvenuto {user.username}</span>
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
    </nav>
  );
}

export default Navbar;
