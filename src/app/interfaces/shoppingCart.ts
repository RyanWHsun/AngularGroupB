export interface ShoppingCartItem {
  fUserId: number;
  fCartItemId: number;
  fItemType: string;
  fItemId: number;
  fPrice: number;
  fQuantity: number;
  fItemName: string;
  fSingleImage: string;
  fSellerName: string | null;
  fSpecification: string | null;
  selected?: boolean | null;
  fProductStock?: number | null;
}

export interface Seller {
  name: string;
  selected?: boolean; //全選賣家
  products: ShoppingCartItem[];
}

export interface addProductToCart {
  fItemType: string;
  fItemId: number;
  fPrice: number;
  fQuantity: number;
}

export interface userInfo {
  fUserId: number;
  fUserName: string;
  fUserPhone: string;
  fUserAddress: string;
  totalBalance: number;
}

export interface CheckoutRequest {
  userInfo: userInfo; // 使用者資訊
  selectedItems: itemsForOrder[]; // 選取的購物車項目
  fPaymentMethod: string;
}

export interface itemsForOrder {
  fCartItemId: number;
  fItemType: string;
  fItemId: number;
  fQuantity: number;
}
