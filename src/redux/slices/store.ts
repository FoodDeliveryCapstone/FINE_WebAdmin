import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TStore, TStoreRequest } from 'src/@types/fine/store';
import { BaseResponse } from 'src/@types/request';
import storeApi from 'src/apis/store';

type TStoreStates = {
  storeRes: BaseResponse<TStore> | null;
  isLoading: boolean;
};

type TStorePut = {
  newStore: TStoreRequest;
  storeId: string;
};

const initialState: TStoreStates = {
  storeRes: null,
  isLoading: true,
};

export const getStoreList = createAsyncThunk('store/getStoreList', async (params?: any) => {
  const response = await storeApi.getStoreList(params);
  return response;
});

export const createStore = createAsyncThunk(
  'store/createStore',
  async (newStore: TStoreRequest) => {
    const response = await storeApi.createStore(newStore);
    return response;
  }
);

export const updateStore = createAsyncThunk('store/updateStore', async (props: TStorePut) => {
  const response = await storeApi.updateStore(props.newStore, props.storeId);
  return response;
});

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStoreList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStoreList.fulfilled, (state, action) => {
      state.storeRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createStore.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createStore.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateStore.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateStore.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
// export const {} = storeSlice.actions;
const { reducer } = storeSlice;
export default reducer;
