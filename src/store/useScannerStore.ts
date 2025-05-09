import { create } from 'zustand';

interface Product {
  barcode: string;
  name: string;
  description: string;
  amount: number;
  prezzoacquisto: number;
  prezzovendita: number;
}

interface ScannerState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (barcode: string, updated: Product) => boolean;
}

export const useScannerStore = create<ScannerState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (barcode, updatedProduct) => {
    let updated = false;
    set((state) => {
      const index = state.products.findIndex((p) => p.barcode === barcode);
      if (index === -1) {
        return {};
      }
      const updatedProducts = [...state.products];
      updatedProducts[index] = updatedProduct;
      updated = true;
      return { products: updatedProducts };
    });
    return updated;
  }
}));
