import { useNavigate } from 'react-router-dom';

function GuestPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <img src="/logo.png" alt="Logo" className="w-32 h-32 mb-4" />
      <h1 className="text-2xl font-bold">Benvenuto!</h1>
      <p className="mt-2 text-gray-600">
        Effettua il login per accedere all'applicazione.
        
      </p>
      <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Vai al Login
          </button>
    </div>
  );
}

export default GuestPage;
