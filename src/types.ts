export interface Product {
  barcode: string;
  nameZh?: string;
  nameEn?: string;
  imageUrl?: string;
  source?: string;
  quantity?: string;
  brands?: string;
  categoriesTags?: string; // 对应你返回的 categoriesTags
  countriesTags?: string;  // 对应你返回的 countriesTags
  origins?: string;
  ingredients?: string;
  novaGroup?: number;      // 0 或 1-4
}

export interface ApiResponse {
  code: number;
  message: string;
  data?: Product;
}