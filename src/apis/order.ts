import {
  TActivePartyOrderRequest,
  TActivePartyOrderResponse,
  TOrder,
  TOrderDetail,
  TOrderDetailByStoreRequest,
  TOrderRequest,
  TOrderResponse,
  TPartyOrder,
  TPrepareCoOrderRequest,
  TPrepareOrderRequest,
  TPrepareOrderResponse,
  TSimulateOrderPrepareResponse,
  TSimulateOrderRequest,
  TSimulateOrderResponse,
  TUpdateOrderStatus,
  TUpdateOrderStatusPrepare,
} from 'src/@types/fine/order';
import { BaseResponse, PostResponse, PutResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';
const updateOrderStatus = (orderId: string, orderStatus: number): Promise<BaseResponse<TOrder>> =>
  request
    .put(`/admin/order/status/${orderId}`, { orderStatus: orderStatus })
    .then((res) => res.data);

const getOrderList = (params?: any): Promise<BaseResponse<TOrder>> =>
  request
    .get(`/admin/order`, {
      params: params,
    })
    .then((res) => res.data);

const getOrderDetailListByStore = (
  props: TOrderDetailByStoreRequest
): Promise<BaseResponse<TOrderDetail>> =>
  request
    .get(`/admin/orderdetail/all/${props.storeId}`, {
      params: props.params,
    })
    .then((res) => res.data);

const createOrder = (OrderRequest: TOrderRequest, customerId: string) =>
  request
    .post<PostResponse<TOrderResponse>>(`/admin/order`, OrderRequest, {
      params: {
        customerId: customerId,
      },
    })
    .then((res) => res.data);

const prepareOrder = (PreOrderRequest: TPrepareOrderRequest, customerId: string) =>
  request
    .post<PostResponse<TPrepareOrderResponse>>(`/admin/order/preOrder`, PreOrderRequest, {
      params: {
        customerId: customerId,
      },
    })
    .then((res) => res.data);

const activeCoOrder = (activeOrderRequest: TActivePartyOrderRequest, customerId: string) =>
  request
    .post<PostResponse<TActivePartyOrderResponse>>(
      `/admin/order/coOrder/active`,
      activeOrderRequest,
      {
        params: {
          customerId: customerId,
        },
      }
    )
    .then((res) => res.data);

const joinCoOrder = (partyCode: string, customerId: string) =>
  request
    .put<PostResponse<TPartyOrder>>(
      `/admin/order/coOrder`,
      {},
      {
        params: {
          partyCode: partyCode,
          customerId: customerId,
        },
      }
    )
    .then((res) => res.data);

const addProductToCoOrder = (activeOrderRequest: TActivePartyOrderRequest, customerId: string) =>
  request
    .post<PostResponse<TPartyOrder>>(`/admin/order/coOrder/card`, activeOrderRequest, {
      params: {
        customerId: customerId,
      },
    })
    .then((res) => res.data);
const confirmCoOrder = (partyCode: string, customerId: string) =>
  request
    .post<PostResponse<TPartyOrder>>(`/admin/order/confirmation`, {
      params: {
        partyCode: partyCode,
        customerId: customerId,
      },
    })
    .then((res) => res.data);
const prepareCoOrder = (PreCoOrderRequest: TPrepareCoOrderRequest) =>
  request
    .post<PostResponse<TPrepareOrderResponse>>(`/admin/order/preOrder`, PreCoOrderRequest, {})
    .then((res) => res.data);

const simulateOrder = (SimulateOrderRequest: TSimulateOrderRequest) =>
  request
    .post<PostResponse<TSimulateOrderResponse>>(`/admin/simulate/order`, SimulateOrderRequest, {})
    .then((res) => res.data);

const simulateFinishedOrder = (StatusOrderRequest: TUpdateOrderStatus) =>
  request
    .put('/admin/simulate/status/finish', StatusOrderRequest, {})
    .then((res) => res.data);
const simulateboxStored = (StatusOrderRequest: TUpdateOrderStatus) =>
  request
    .put('/admin/simulate/status/boxStored', StatusOrderRequest, {})
    .then((res) => res.data);
const simulateFinishePrepare = (StatusOrderRequest: TUpdateOrderStatusPrepare) =>
  request
    .put<PutResponse<TSimulateOrderPrepareResponse>>('/admin/simulate/status/finishPrepare', StatusOrderRequest, {})
    .then((res) => res.data);
const simulateDelivery = (StatusOrderRequest: TUpdateOrderStatus) =>
  request
    .put('/admin/simulate/status/delivering', StatusOrderRequest, {})
    .then((res) => res.data);

const getOrderByStaff = (storeId?: string): Promise<BaseResponse<TOrder>> =>
  request
    .get(`/admin/orderDetail/all`, {
      params: {
        storeId: storeId,
        orderStatus: 4,
        PageSize: 100
      },
    })
    .then((res) => res.data);

const getOrderByStaffPassio = (params?: any): Promise<BaseResponse<TOrder>> =>
  request
    .get(`/admin/orderDetail/all/8DB35955-BBC5-40FB-B638-CB44AC786519?orderStatus=4&PageSize=100`, {
      params: params,
    })
    .then((res) => res.data);
const getOrderByStaff711 = (params?: any): Promise<BaseResponse<TOrder>> =>
  request
    .get(`/admin/orderDetail/all/751A2190-D06C-4D5E-9C5A-08C33C3DB266?orderStatus=4&PageSize=100`, {
      params: params,
    })
    .then((res) => res.data);
const getOrderByStaffLaha = (params?: any): Promise<BaseResponse<TOrder>> =>
  request
    .get(`/admin/orderDetail/all/E19422E9-2C97-4C6E-8919-F4AE0FA739D5?orderStatus=4&PageSize=100`, {
      params: params,
    })
    .then((res) => res.data);
const getOrderByStoreId = (
  props: TOrderDetailByStoreRequest
): Promise<BaseResponse<TOrderDetail>> =>
  request
    .get(`/admin/orderdetail/all/${props.storeId}`, {
      params: props.params,
    })
    .then((res) => res.data);
const orderApi = {
  getOrderByStaff,
  getOrderByStoreId,
  simulateDelivery,
  simulateboxStored,
  simulateFinishePrepare,
  getOrderByStaffLaha,
  getOrderByStaffPassio,
  getOrderByStaff711,
  simulateFinishedOrder,
  simulateOrder,
  updateOrderStatus,
  activeCoOrder,
  joinCoOrder,
  addProductToCoOrder,
  confirmCoOrder,
  prepareCoOrder,
  getOrderList,
  prepareOrder,
  createOrder,
};

export default orderApi;
