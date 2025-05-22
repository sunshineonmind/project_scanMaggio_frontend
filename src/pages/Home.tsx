import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import GuestPage from './GuestPage';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <GuestPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Titolo sopra */}
      <h1 className="text-4xl font-bold mt-10 text-gray-800">
        Benvenuta {user?.username}!
      </h1>

      {/* Jumbotron Container */}
      <div className="flex flex-col md:flex-row gap-10 justify-center mt-16 px-4 w-full max-w-6xl">
        {/* Jumbotron Scannerizza */}
        <div
          className="flex-1 border rounded-xl shadow-md p-8 bg-white text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          onClick={() => {
            if (location.pathname !== '/scannerizza') {
              navigate('/scannerizza');
            }
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Barcode</h2>
          <p className="mb-6 text-gray-600">
            Scannerizza i prodotti che desideri e poi esportali in excel.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
            Vai a Scannerizza
          </button>
        </div>

        {/* Jumbotron Fatture */}
        <div
          className="flex-1 border rounded-xl shadow-md p-8 bg-white text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          onClick={() => navigate('/fatture')}
        >
          <h2 className="text-2xl font-bold mb-4 text-green-600">Upload Fatture</h2>
          <p className="mb-6 text-gray-600">
            Carica una fattura per recuperare i dati dei prodotti scannerizzati.
          </p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
            Vai a Fatture
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
