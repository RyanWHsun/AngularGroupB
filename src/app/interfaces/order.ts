export interface buyerOrderAll {
  fOrderId: number;
  fOrderStatusId: number;
  fStatusName: string;
  fShipAddress: string;
  fOrderDate: string;
  fOrderAmount: number;
  sellerName: string;
  fProductName: string[];
}

export interface OrderStatusHistory {
  fOrderStatusId: number;
  fStatusName: string;
  fTimestamp: string;
}

export interface OrderDetail {
  fOrderDetailsId: number;
  fItemId: number;
  fOrderQty: number;
  fUnitPrice: number;
  fProductName: string;
  fProductImage?: string; // Base64 圖片
}

export interface OrderDetailsResponse {
  orderDetails: OrderDetail[];
  statusHistory: OrderStatusHistory[];
}
