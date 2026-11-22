export interface Product {
  barcode: string;
  nameZh?: string;
  nameEn?: string;
  imageUrl?: string;
  source?: string;
  quantity?: string;
  brands?: string;
  categories?: string;
  countries?: string;
  origins?: string;
  ingredients?: string;
  novaGroup?: number; // 1-4
}

export interface ApiResponse {
  code: number;
  message: string;
  data?: Product;
}