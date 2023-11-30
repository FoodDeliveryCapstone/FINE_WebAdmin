import { TCustomer } from './customer';
import { TStation } from './station';
import { TTimeSlot } from './timeslot';

export interface TOrder {
  id: string;
  orderCode: string;
  customerId: string;
  checkInDate: string;
  finalAmount: number;
  orderStatus: number;
  orderType: number;
  timeSlot: TTimeSlot;
  stationId: string;
  isConfirm: boolean;
  isPartyMode: boolean;
  itemQuantity: number;
  note: string;
  refundAmount: number;
  finalAmountAfterRefund: number;
  refundNote: string;
  orderDetails: TOrderDetail[];
}

export interface TOrderRequest {
  id: string;
  partyCode: string | null;
  orderCode: string;
  totalAmount: number;
  finalAmount: number;
  totalOtherAmount: number;
  orderType: number;
  timeSlotId: string;
  stationId: string;
  paymentType: number;
  isPartyMode: boolean;
  itemQuantity: number;
  point: number;
  orderDetails: TOrderDetail[];
  otherAmounts: TOtherAmount[];
}

export interface TOrderDetail {
  id: string;
  orderId: string;
  productInMenuId: string;
  productId: string;
  storeId: string;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  note: string;
}

export interface TPreOrderDetail {
  productId: string;
  quantity: number;
  note: string;
}

export interface TOrderDialog {
  id: string;
  orderCode: string;
  customer?: TCustomer;
  checkInDate: string;
  finalAmount?: string;
  orderStatus: number;
  orderType: number;
  timeSlot: TTimeSlot;
  station?: TStation;
  isConfirm: boolean;
  isPartyMode: boolean;
  itemQuantity: number;
  note: string;
  orderDetails: TOrderDetail[];
  refundAmount: string;
  finalAmountAfterRefund: string;
  refundNote: string;
}

export interface TOrderResponse {
  id: string;
  orderCode: string;
  totalAmount: number;
  finalAmount: number;
  totalOtherAmount: number;
  orderType: number;
  timeSlotId: string;
  stationId: string;
  paymentType: number;
  isPartyMode: boolean;
  itemQuantity: number;
  point: number;
  orderDetails: TOrderDetail[];
  otherAmounts: TOtherAmount[];
}
export interface TOtherAmount {
  id: string;
  orderId: string;
  amount: number;
  amountType: number;
}
export interface TPrepareOrderRequest {
  orderType: number;
  timeSlotId: string;
  orderDetails: TPreOrderDetail[];
}
export interface TPrepareCoOrderRequest {
  customerId: string;
  orderType: number;
  partyCode: string;
}
export interface TPrepareOrderResponse {
  id: string;
  orderCode: string;
  customer: TCustomer;
  totalAmount: number;
  finalAmount: number;
  totalOtherAmount: number;
  otherAmounts: TOtherAmount[];
  orderStatus: number;
  orderType: number;
  timeSlot: TTimeSlot;
  stationOrder: any;
  point: number;
  isConfirm: boolean;
  isPartyMode: boolean;
  itemQuantity: number;
  note: any;
  updateAt: any;
  orderDetails: TOrderDetail[];
}

export interface TActivePartyOrderRequest {
  orderType: number;
  partyType: number;
  timeSlotId: string;
  orderDetails: TPreOrderDetail[];
}

export interface TActivePartyOrderResponse {
  id: string;
  partyCode: string;
  partyType: number;
  timeSlot: TTimeSlot;
  partyOrder: TPartyOrder[];
}

export interface TPartyOrder {
  customer: TCustomer;
  totalAmount: number;
  itemQuantity: number;
  orderDetails: TPartyOrderDetail[];
}

export interface TPartyOrderDetail {
  productInMenuId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  note: string;
}

export type TUpdateOrderStatus = {
  totalOrder: number;
};
export type TUpdateOrderStatusPrepare = {
  timeSlotId: string;
};
export type TSimulateOrderPrepareResponse = {
  orderSuccess: TOrderSuccessPrepare[];
  orderFailed: TOrderFailedPrepare[];
};
export interface TOrderSuccessPrepare {
  storeId: string;
  staffName: string;
  productName: string;
  quantity: number;
}
export interface TOrderFailedPrepare {
  storeId: string;
  staffName: string;
  productName: string;
  quantity: number;
  status: TStatusPrepare;
}
export interface TStatusPrepare {
  success: boolean;
  message: string;
  errorCode: number;
}

export type TOrderDetailByStoreRequest = {
  storeId: string;
  params?: any;
};
export interface TSimulateOrderRequest {
  timeSlotId: string
  singleOrder?: SingleOrder
  coOrder?: CoOrder
}

export interface SingleOrder {
  totalOrder: number

}

export interface CoOrder {
  totalOrder: number
  customerEach: number
}

export interface TSimulateOrderResponse {
  timeslot: TTimeSlot;
  singleOrderResult: TSingleOrderResult;
  // coOrderOrderResult: TCoOrderOrderResult;
}

export interface TSingleOrderResult {
  orderSuccess: OrderSuccess[]
  orderFailed: any[]
}

export interface OrderSuccess {
  customerName: string
  message: string
  orderDetails: OrderDetail[]
}

export interface OrderDetail {
  storeId: string
  storeName: string
  productAndQuantity: ProductAndQuantity[]
}

export interface ProductAndQuantity {
  productName: string
  quantity: number
}



// export interface TCoOrderOrderResult {
//   orderSuccess: TOrderSuccess[];
//   orderFailed: TOrderFailed[];
// }

