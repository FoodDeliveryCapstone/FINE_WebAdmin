import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TCustomer } from 'src/@types/fine/customer';
import { TTransaction, TTransactionRefund } from 'src/@types/fine/transaction';
import { BaseResponse } from 'src/@types/request';
import customerApi from 'src/apis/customer';
import transactionApi from 'src/apis/transaction';

type TCustomerStates = {
  customerRes: BaseResponse<TCustomer> | null;
  transationRes: BaseResponse<TTransaction> | null;
  transationRefundRes: BaseResponse<TTransactionRefund> | null;
  currentCustomerDetail: TCustomer | null;
  isLoading: boolean;
};
const initialState: TCustomerStates = {
  customerRes: null,
  currentCustomerDetail: null,
  transationRes: null,
  transationRefundRes: null,
  isLoading: true,
};

export const getCustomerList = createAsyncThunk(
  'customer/getCustomerList',
  async (params?: any) => {
    const response = await customerApi.getCustomerList(params);

    return response;
  }
);

export const getTransaction = createAsyncThunk(
  'customer/transaction',
  async (params?: any) => {
    const response = await transactionApi.getTransaction(params);

    return response;
  }
);
export const getTransactionRefund = createAsyncThunk(
  'customer/transactionRefund',
  async (params?: any) => {
    const response = await transactionApi.getTransactionRefund(params);

    return response;
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCurrentCustomerDetail: (state, action: PayloadAction<TCustomer>) => {
      state.currentCustomerDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomerList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCustomerList.fulfilled, (state, action) => {
      state.customerRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTransaction.fulfilled, (state, action) => {
      state.transationRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTransactionRefund.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTransactionRefund.fulfilled, (state, action) => {
      state.transationRefundRes = action.payload;
      state.isLoading = false;
    });
  },
});
export const { setCurrentCustomerDetail } = customerSlice.actions;
const { reducer } = customerSlice;
export default reducer;
