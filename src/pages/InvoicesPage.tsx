import { useState } from 'react';
import InvoiceProductRow from '../components/InvoiceProductRow';

interface InvoiceMetadata {
  tipo_documento: string;
  articolo_73: string;
  numero_documento: string;
  data_documento: string;
  codice_destinatario: string;
  modalita_pagamento: string;
  dettagli: string;
  scadenze: string;
  importo: number;
  fornitore: string;
  cliente: string;
}

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

function InvoicesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prodotti, setProdotti] = useState<Product[]>([]);
  const [fattura, setFattura] = useState<InvoiceMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [insertedBarcodes, setInsertedBarcodes] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setMessage('');
    setProdotti([]);
    setFattura(null);
    setInsertedBarcodes([]);

    const formData = new FormData();
    formData.append('fattura', selectedFile);

    try {
      const res = await fetch('http://localhost:3001/api/invoices/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProdotti(data.prodotti || []);
        setFattura(data.fattura || null);
        setMessage(`Prodotti trovati: ${data.prodotti.length}`);
      } else {
        setMessage('Errore durante l\'upload');
      }
    } catch (err) {
      console.error(err);
      setMessage('Errore imprevisto');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = (barcode: string) => {
    setProdotti((prev) => prev.filter((p) => p.barcode !== barcode));
    setInsertedBarcodes((prev) => [...prev, barcode]);
  };

  const handleMarkInserted = (barcode: string) => {
    setInsertedBarcodes((prev) => [...prev, barcode]);
    setProdotti((prev) =>
      prev.map((p) =>
        p.barcode === barcode ? { ...p, found: true } : p
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Fattura</h1>

      <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Caricamento...' : 'Carica PDF'}
      </button>

      {message && <p className="mt-4 font-semibold">{message}</p>}

      {fattura && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Dati Fattura</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Tipo documento:</strong> {fattura.tipo_documento}</div>
            <div><strong>Articolo 73:</strong> {fattura.articolo_73}</div>
            <div><strong>Numero documento:</strong> {fattura.numero_documento}</div>
            <div><strong>Data documento:</strong> {fattura.data_documento}</div>
            <div><strong>Codice destinatario:</strong> {fattura.codice_destinatario}</div>
            <div><strong>Modalità pagamento:</strong> {fattura.modalita_pagamento}</div>
            <div><strong>Dettagli:</strong> {fattura.dettagli}</div>
            <div><strong>Scadenze:</strong> {fattura.scadenze}</div>
            <div><strong>Importo:</strong> {fattura.importo} €</div>
            <div><strong>Fornitore:</strong> {fattura.fornitore}</div>
            <div><strong>Cliente:</strong> {fattura.cliente}</div>
          </div>
        </div>
      )}

      {prodotti.length > 0 && (
        <table className="mt-6 w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Barcode</th>
              <th className="border p-2">Descrizione</th>
              <th className="border p-2">Quantità</th>
              <th className="border p-2">UM</th>
              <th className="border p-2">Sconto</th>
              <th className="border p-2">%IVA</th>
              <th className="border p-2">Prezzo Unitario</th>
              <th className="border p-2">Totale</th>
              <th className="border p-2">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map((p, i) => (
              <InvoiceProductRow
                key={i}
                product={p}
                onUpdate={() => handleMarkInserted(p.barcode)}
                onRemove={handleRemoveProduct}
                insertedBarcodes={insertedBarcodes}
                onMarkInserted={handleMarkInserted}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InvoicesPage;
