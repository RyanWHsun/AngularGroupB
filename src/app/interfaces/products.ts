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

export interface myProductList {
  fProductId: number;
  fProductCategoryId: number;
  fProductName: string;
  fProductPrice: number;
  fIsOnSales: boolean;
  fStock: number;
  fProductDateAdd: string;
  fProductUpdated: string | null;
  fSingleImage: string;
  selected?: boolean; // 用來追蹤 checkbox 是否被選取
}

export interface createProduct {
  fProductId?: number;
  fProductCategoryId: number;
  fProductName: string;
  fProductPrice: number;
  fProductDescription: string;
  fIsOnSales: boolean;
  fStock: number;
  fImage: string[]; // Base64 圖片陣列
}

export interface latestProducts {
  fProductId: number;
  fProductName: string;
  fProductDateAdd: string;
  fSingleImage: string | null; // Base64 字串
}
