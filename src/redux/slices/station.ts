import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TBoxStation, TStation } from 'src/@types/fine/station';
import { BaseResponse } from 'src/@types/request';
import stationApi from 'src/apis/station';
import { request } from 'src/utils/axios';

type TStationStates = {
  stationRes: BaseResponse<TStation> | null;
  isLoading: boolean;
};
const initialState: TStationStates = {
  stationRes: null,
  isLoading: true,
};

export const getStationList = createAsyncThunk('station/getStationList', async (page?: number) => {
  const response = await stationApi.getStationList(page);

  return response;
});

export const createBox = createAsyncThunk(
  'station/createBox',
  async (newBox: TBoxStation) => {
    const response = await stationApi.createBox(newBox);
    return response;
  }
);
export const updateBox = createAsyncThunk('station/updateBox', async (props: TBoxStation) => {
  const response = await stationApi.updateBox(props.id);
  return response;
});
const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStationList.fulfilled, (state, action) => {
      state.stationRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createBox.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createBox.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateBox.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateBox.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
// export const {} = stationSlice.actions;
const { reducer } = stationSlice;
export default reducer;
