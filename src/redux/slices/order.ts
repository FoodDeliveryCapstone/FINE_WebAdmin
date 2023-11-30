import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TOrder,
  TOrderDetail,
  TOrderDetailByStoreRequest,
  TOrderDialog,
} from 'src/@types/fine/order';
import { BaseResponse } from 'src/@types/request';
import orderApi from 'src/apis/order';

type TOrderStates = {
  orderDetailByStoreRes: BaseResponse<TOrderDetail> | null;
  orderRes: BaseResponse<TOrder> | null;
  currentOrderDetail: TOrderDialog | null;
  isLoading: boolean;
};
const initialState: TOrderStates = {
  orderDetailByStoreRes: null,
  orderRes: null,
  currentOrderDetail: null,
  isLoading: true,
};

export const getOrderList = createAsyncThunk('order/getOrderList', async (params?: any) => {
  const response = await orderApi.getOrderList(params);

  return response;
});
export const getOrderDetailListByStore = createAsyncThunk(
  'order/getOrderDetailListByStore',
  async (props: TOrderDetailByStoreRequest) => {
    const response = await orderApi.getOrderDetailListByStore(props);

    return response;
  }
);
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrderDetail: (state, action: PayloadAction<TOrderDialog>) => {
      state.currentOrderDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderList.fulfilled, (state, action) => {
      state.orderRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getOrderDetailListByStore.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderDetailListByStore.fulfilled, (state, action) => {
      state.orderDetailByStoreRes = action.payload;
      state.isLoading = false;
    });
  },
});
export const { setCurrentOrderDetail } = orderSlice.actions;
const { reducer } = orderSlice;
export default reducer;
