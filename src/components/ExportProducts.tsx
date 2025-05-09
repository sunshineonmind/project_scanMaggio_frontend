import * as XLSX from 'xlsx';
import React from 'react';

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
}

interface ExportProductsProps {
  products: Product[];
  selectedIds: number[];
}

const ExportProducts: React.FC<ExportProductsProps> = ({ products, selectedIds }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
  };

  const exportExcel = (all: boolean) => {
    const dataToExport = all
      ? products
      : products.filter((p) => selectedIds.includes(p.idProduct));

    if (dataToExport.length === 0) {
      alert('Nessun prodotto da esportare');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prodotti');
    if(all){
        XLSX.writeFile(workbook, `tutti_prodotti_${getCurrentDateTime()}.xlsx`);
    }else{
        XLSX.writeFile(workbook, `solo_prodotti_selezionati_${getCurrentDateTime()}.xlsx`);
    }
    
  };

  return (
    <div className="mb-4 space-x-4">
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        onClick={() => exportExcel(true)}
      >
        Esporta Tutti
      </button>
      <button
         className="text-white px-4 py-2 rounded"
         style={{ backgroundColor: '#34a4eb' }}
        onClick={() => exportExcel(false)}
      >
        Esporta Selezionati
      </button>
    </div>
  );
};

export default ExportProducts;
