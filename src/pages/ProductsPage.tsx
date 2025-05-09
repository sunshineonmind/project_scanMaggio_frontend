
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
  prezzo_prodotto_scontato:number;
}

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const fetchProducts = () => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Errore nel caricamento prodotti:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const barcode = p.barcode?.toLowerCase() || '';
    const name = p.description?.toLowerCase() || '';
    return (
      barcode.includes(search.toLowerCase()) ||
      name.includes(search.toLowerCase())
    );
  });

  const handleEdit = async (product: Product) => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${product.barcode}`);
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
      const res = await fetch(`http://localhost:3001/api/products/${barcode}`, {
        method: 'DELETE',
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prodotti</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">✔</th>
              <th className="border px-4 py-2">Barcode</th>
              <th className="border px-4 py-2">Descrizione</th>
              <th className="border px-4 py-2">Prezzo Prodotto Scontato</th>
              <th className="border px-4 py-2">Quantità</th>
              <th className="border px-4 py-2">Prezzo Vendita</th>
              <th className="border px-4 py-2">Sconto</th>
              <th className="border px-4 py-2">IVA</th>
              <th className="border px-4 py-2">UM</th>
              <th className="border px-4 py-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prod, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(prod.idProduct)}
                    onChange={() => handleCheckboxChange(prod.idProduct)}
                  />
                </td>
                <td className="border px-4 py-2">{prod.barcode}</td>
                <td className="border px-4 py-2">{prod.description}</td>
                <td className="border px-4 py-2">{prod.prezzo_prodotto_scontato} €</td>
                <td className="border px-4 py-2">{prod.amount}</td>
                <td className="border px-4 py-2">{prod.prezzovendita} €</td>
                <td className="border px-4 py-2">{prod.sconto_maggiorazione}</td>
                <td className="border px-4 py-2">{prod.iva_percentuale}</td>
                <td className="border px-4 py-2">{prod.um}</td>
                <td className="border px-4 py-2 space-x-2">
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
