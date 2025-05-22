import { useNavigate } from 'react-router-dom';

function GuestPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
      </div>
      <h1 className="text-2xl font-bold">Benvenuto!</h1>
      <p className="mt-2 text-gray-600">
        Effettua il login per accedere all'applicazione.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Vai al Login
      </button>
    </div>
  );
}

export default GuestPage;
