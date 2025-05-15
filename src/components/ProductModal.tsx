import { useState, useEffect } from 'react';
import { useScannerStore } from '../store/useScannerStore';

interface ProductModalProps {
  barcode: string;
  existingProduct?: {
    name: string;
    description: string;
    amount: number;
    prezzoacquisto: number;
    prezzovendita: number;
    prezzo_prodotto_scontato: number;
  };
  onClose: () => void;
}

function ProductModal({ barcode, existingProduct, onClose }: ProductModalProps) {
  const addProduct = useScannerStore((state) => state.addProduct);
  const updateProduct = useScannerStore((state) => state.updateProduct);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(1);
  const [prezzoacquisto, setPrezzoAcquisto] = useState(0);
  const [prezzovendita, setPrezzoVendita] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [prezzo_prodotto_scontato, setPrezzoProdottoScontato] = useState(0);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name || '');
      setDescription(existingProduct.description || '');
      setAmount(existingProduct.amount || 1);
      setPrezzoAcquisto(existingProduct.prezzoacquisto || 0);
      setPrezzoVendita(existingProduct.prezzovendita || 0);
      setPrezzoProdottoScontato(existingProduct.prezzo_prodotto_scontato || 0);

    }
  }, [existingProduct]);

  const handleSave = async () => {
    if (!barcode) {
      setError('Il campo barcode è obbligatorio');
      return;
    }

    const newProduct = {
      barcode,
      name,
      description,
      amount,
      prezzoacquisto,
      prezzovendita,
    };

    try {
      if (existingProduct) {
        const updated = updateProduct(barcode, newProduct);
        if (!updated) addProduct(newProduct);

        const response = await fetch(`http://localhost:3001/api/products/${barcode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) throw new Error('Errore aggiornamento su server');
        console.log('Prodotto aggiornato nel database');
      } else {
        addProduct(newProduct);

        const response = await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) throw new Error('Errore salvataggio su server');
        console.log('Prodotto inserito nel database');
      }
    } catch (error) {
      console.error('Errore nel salvataggio o aggiornamento:', error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {existingProduct ? 'Modifica prodotto' : 'Aggiungi nuovo prodotto'}
        </h2>

        <div className="flex flex-col gap-4">
          {/* Barcode */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Barcode</label>
            <input
              type="text"
              className={`border p-2 rounded ${error ? 'border-red-500' : ''}`}
              value={barcode}
              readOnly={!!existingProduct}
              onChange={() => setError(null)}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Nome */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Nome</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Descrizione */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Descrizione</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Quantità */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Quantità</label>
            <input
              type="number"
              className="border p-2 rounded"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          {/* Prezzo acquisto */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Prezzo Prodotto Scontato</label>
            <input
              type="number"
              className="border p-2 rounded"
              value={prezzo_prodotto_scontato}
              onChange={(e) => setPrezzoProdottoScontato(Number(e.target.value))}
            />
          </div>

          {/* Prezzo vendita */}
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Prezzo di vendita</label>
            <input
              type="number"
              className="border p-2 rounded"
              value={prezzovendita}
              onChange={(e) => setPrezzoVendita(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-6 rounded"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
