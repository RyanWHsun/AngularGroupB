export interface Products {
  fProductId: number;
  fProductCategoryId: number;
  fProductName: string;
  fProductPrice: number;
  fIsOnSales: boolean;
  fStock: number;
  fUserId: number;
  fUserNickName: string | null;
  fUserImage: string | null; // Base64 字串
  fImage: string | null; // Base64 字串
}

export interface ProductDetail {
  fProductId: number;
  fProductCategoryId: number;
  fProductName: string;
  fProductPrice: number;
  fProductDescription: string | null;
  fIsOnSales: boolean;
  fStock: number;
  fProductDateAdd: string;
  fProductUpdated: string | null;
  fImage: string[]; // 照片 Base64 陣列
}
