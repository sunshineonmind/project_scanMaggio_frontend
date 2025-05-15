import { useState } from 'react';

interface Product {
  barcode: string;
  name: string;
  description: string;
  amount: number;
  prezzoacquisto: number;
  prezzovendita: number;
  um: string;
  sconto: string;
  iva: string;
  prezzo_totale: number;
  prezzo_unitario: number;
  found: boolean;
}

interface Props {
  product: Product;
  onUpdate?: () => void;
  onRemove: (barcode: string) => void;
  onMarkInserted: (barcode: string) => void;
  insertedBarcodes: string[];
}

function InvoiceProductRow({
  product,
  onUpdate,
  onRemove,
  onMarkInserted,
  insertedBarcodes
}: Props) {
  const [editProduct, setEditProduct] = useState(product);
  const [editMode, setEditMode] = useState(false);


  const handleSave = async () => {
    try {
      const method = product.found ? 'PUT' : 'POST';
      const url = product.found
        ? `http://localhost:3001/api/products/${product.barcode}`
        : `http://localhost:3001/api/products`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        setEditMode(false);
        if (onUpdate) onUpdate();
        if (!product.found && onMarkInserted) onMarkInserted(product.barcode);
      } else {
        alert('Errore nel salvataggio');
      }
    } catch (err) {
      console.error('Errore:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare il prodotto?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${product.barcode}`, {
        method: 'DELETE',
      });

      if (response.ok && onUpdate) {
        onUpdate();
      } else {
        alert('Errore durante la cancellazione');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    onRemove(product.barcode);
  };

  return (
    <tr>
      <td className="border p-2">{product.barcode}</td>
      <td className="border p-2">{product.description}</td>
      <td className="border p-2">{product.amount}</td>
      <td className="border p-2">{product.um}</td>
      <td className="border p-2">{product.sconto}</td>
      <td className="border p-2">{product.iva}</td>
      <td className="border p-2">{product.prezzo_unitario} €</td>
      <td className="border p-2">{product.prezzo_totale} €</td>
      <td className="border p-2 space-x-2">
        {product.found ? (
          <>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-400 text-white px-2 py-1 rounded"
              >
                Modifica
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Salva
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditProduct(product);
                  }}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Annulla
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Elimina
            </button>
          </>
        ) : insertedBarcodes.includes(product.barcode) ? (
          <span className="text-sm text-green-600 font-semibold">✅ Già inserito</span>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Inserisci
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-2 py-1 rounded"
            >
              Annulla
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default InvoiceProductRow;
