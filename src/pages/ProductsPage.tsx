import { useEffect, useState } from 'react';
import ProductModal from '../components/ProductModal';
import ExportProducts from '../components/ExportProducts';

interface Product {
  idProduct: number;
  barcode: string;
  name: string;
  description: string;
  amount: number;
  prezzovendita: number;
  prezzoacquisto: number;
  um?: string;
  sconto_maggiorazione?: string;
  iva_percentuale?: number;
  prezzo_totale?: number;
  prezzo_unitario?: number;
  createdon?: string;
  modifiedon?: string;
  found: boolean;
  prezzo_prodotto_scontato: number;
}

function formatPrezzo(val: string | number | null | undefined): string {
  const num = Number(val ?? 0);
  return num.toFixed(2);
}

function ProductsPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

 const fetchProducts = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('❌ Nessun token trovato nel localStorage');
    setProducts([]); // Evita .filter su null
    return;
  }

  fetch(`${apiUrl}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`❌ Errore HTTP ${res.status}`);
        throw new Error(`Errore HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.warn('⚠️ Dati non validi:', data);
        setProducts([]);
      }
    })
    .catch((err) => {
      console.error('❌ Errore fetch:', err);
      setProducts([]);
    });
};


  useEffect(() => {
    fetchProducts();
  }, []);

const filtered = Array.isArray(products)
  ? products.filter((p) => {
      const barcode = p.barcode?.toLowerCase() || '';
      const name = p.description?.toLowerCase() || '';
      return (
        barcode.includes(search.toLowerCase()) ||
        name.includes(search.toLowerCase())
      );
    })
  : [];



  const handleEdit = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/products/${product.barcode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Errore nel recupero del prodotto');

      const freshProduct = await res.json();
      setSelectedProduct(freshProduct);
      setShowModal(true);
    } catch (err) {
      console.error('Errore caricamento prodotto:', err);
      alert('Errore nel recupero del prodotto dal database');
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleDelete = async (barcode: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/products/${barcode}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        fetchProducts();
      } else {
        throw new Error('Errore durante l\'eliminazione');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Prodotti</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={handleCreate}
        >
          + Nuovo Prodotto
        </button>
      </div>

      <div className="mb-4">
        <ExportProducts products={products} selectedIds={selectedProducts} />
      </div>

      <input
        type="text"
        placeholder="Cerca per barcode o nome"
        className="mb-6 p-3 border border-gray-300 rounded w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 sm:px-4 py-2">✔</th>
              <th className="border px-2 sm:px-4 py-2">Barcode</th>
              <th className="border px-2 sm:px-4 py-2">Descrizione</th>
              <th className="border px-2 sm:px-4 py-2 whitespace-nowrap">Prezzo Scontato</th>
              <th className="border px-2 sm:px-4 py-2 whitespace-nowrap">Prezzo Unitario</th>
              <th className="border px-2 sm:px-4 py-2">Quantità</th>
              <th className="border px-2 sm:px-4 py-2 whitespace-nowrap">Prezzo Vendita</th>
              <th className="border px-2 sm:px-4 py-2">Sconto</th>
              <th className="border px-2 sm:px-4 py-2">IVA</th>
              <th className="border px-2 sm:px-4 py-2">UM</th>
              <th className="border px-2 sm:px-4 py-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-2 sm:px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(prod.idProduct)}
                    onChange={() => handleCheckboxChange(prod.idProduct)}
                  />
                </td>
                <td className="border px-2 sm:px-4 py-2 break-all">{prod.barcode}</td>
                <td className="border px-2 sm:px-4 py-2 break-words">{prod.description}</td>
                <td className="border px-2 sm:px-4 py-2">{formatPrezzo(prod.prezzo_prodotto_scontato)} €</td>
                <td className="border px-2 sm:px-4 py-2">{formatPrezzo(prod.prezzo_unitario)} €</td>
                <td className="border px-2 sm:px-4 py-2">{prod.amount}</td>
                <td className="border px-2 sm:px-4 py-2">{formatPrezzo(prod.prezzovendita)} €</td>
                <td className="border px-2 sm:px-4 py-2">{prod.sconto_maggiorazione}</td>
                <td className="border px-2 sm:px-4 py-2">{prod.iva_percentuale}</td>
                <td className="border px-2 sm:px-4 py-2">{prod.um}</td>
                <td className="border px-2 sm:px-4 py-2 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(prod)}>Modifica</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(prod.barcode)}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductModal
          barcode={selectedProduct?.barcode || ''}
          existingProduct={selectedProduct || undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

export default ProductsPage;
