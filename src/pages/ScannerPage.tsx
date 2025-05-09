import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import ProductModal from '../components/ProductModal';
import { useScannerStore } from '../store/useScannerStore';
import * as XLSX from 'xlsx';

function ScannerPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [existingProduct, setExistingProduct] = useState<any>(undefined);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = "html5qr-code-full-region";
  const { products } = useScannerStore();

  useEffect(() => {
    const initScanner = async () => {
      if (scannerRef.current) return;

      try {
        // Verifica l'esistenza dell'elemento scanner
        const element = document.getElementById(qrCodeRegionId);
        if (!element) {
          console.error("Errore: elemento scanner non trovato.");
          return;
        }

        const scanner = new Html5Qrcode(qrCodeRegionId);
        const devices = await Html5Qrcode.getCameras();

        if (devices.length === 0) {
          console.error("Nessuna fotocamera trovata.");
          return;
        }

        const cameraId = devices[0].id;

        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: element.clientWidth, height: element.clientWidth },
          },
          (decodedText) => {
            onBarcodeScanned(decodedText);
          },
          (errorMessage) => {
            if (!errorMessage.includes("NotFoundException")) {
              console.warn("Errore scansione:", errorMessage);
            }
          }
        );
        scannerRef.current = scanner;
        console.log("Scanner avviato con successo");
      } catch (error) {
        console.error("Errore inizializzazione scanner:", error);
      }
    };

    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        }).catch((err) => console.error("Errore nello stop dello scanner:", err));
      }
    };
  }, []);

  const onBarcodeScanned = async (barcode: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${barcode}`);
      if (response.ok) {
        const productFromDB = await response.json();
        setScannedBarcode(barcode);
        setExistingProduct(productFromDB);
        setShowModal(true);
      } else if (response.status === 404) {
        setScannedBarcode(barcode);
        setExistingProduct(undefined);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Errore nella richiesta al server:", error);
    }
  };

  const handleExportExcel = () => {
    try {
      if (products.length === 0) {
        alert("Nessun prodotto da esportare");
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(products);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Prodotti");
      XLSX.writeFile(workbook, "prodotti_scannerizzati.xlsx");
      console.log("Export completato con successo");
    } catch (error) {
      console.error("Errore durante l'esportazione:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-10 px-4 gap-8">
      {/* Fotocamera */}
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Scannerizza un codice</h1>
        <div id={qrCodeRegionId} className="w-full max-w-md border rounded-lg shadow-lg"></div>

        {showModal && scannedBarcode && (
          <ProductModal
            barcode={scannedBarcode}
            existingProduct={existingProduct}
            onClose={() => {
              setShowModal(false);
              setScannedBarcode(null);
              setExistingProduct(undefined);
            }}
          />
        )}
      </div>

      {/* Lista prodotti scannerizzati */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Prodotti scannerizzati</h2>
          <button
            onClick={handleExportExcel}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Esporta Excel
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-600">Nessun prodotto scannerizzato.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Barcode</th>
                <th className="border p-2">Nome</th>
                <th className="border p-2">Quantità</th>
                <th className="border p-2">Prezzo Vendita</th>
                <th className="border p-2">Prezzo Acquisto</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, index) => (
                <tr key={index}>
                  <td className="border p-2">{prod.barcode}</td>
                  <td className="border p-2">{prod.name}</td>
                  <td className="border p-2">{prod.amount}</td>
                  <td className="border p-2">{prod.prezzovendita} €</td>
                  <td className="border p-2">{prod.prezzoacquisto} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ScannerPage;
