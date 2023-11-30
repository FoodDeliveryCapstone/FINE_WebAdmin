import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TDestination, TDestinationRequest, TFloor } from 'src/@types/fine/destination';
import { BaseResponse } from 'src/@types/request';
import destinationApi from 'src/apis/destination';

type TDestinationStates = {
  destinationRes: BaseResponse<TDestination> | null;
  isLoading: boolean;
  floorRes: BaseResponse<TFloor> | null
};

type TDestinationPut = {
  newDestination: TDestinationRequest;
  destinationId: string;
};

const initialState: TDestinationStates = {
  destinationRes: null,
  isLoading: true,
  floorRes: null
};
export const getFloorList = createAsyncThunk(
  'destination/getFloorList',
  async (destinationId: string) => {
    const response = await destinationApi.getFloorList(destinationId);

    return response;
  }
);


export const getDestinationList = createAsyncThunk(
  'destination/getDestinationList',
  async (params?: any) => {
    const response = await destinationApi.getDestinationList(params);
    return response;
  }
);

export const createDestination = createAsyncThunk(
  'destination/createDestination',
  async (newDestination: TDestinationRequest) => {
    const response = await destinationApi.createDestination(newDestination);
    return response;
  }
);

export const updateDestination = createAsyncThunk(
  'destination/updateDestination',
  async (props: TDestinationPut) => {
    const response = await destinationApi.updateDestination(
      props.newDestination,
      props.destinationId
    );
    return response;
  }
);

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDestinationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDestinationList.fulfilled, (state, action) => {
      state.destinationRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createDestination.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createDestination.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateDestination.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateDestination.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getFloorList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFloorList.fulfilled, (state, action) => {
      state.floorRes = action.payload;
      state.isLoading = false;
    });
  },
});
// export const {} = destinationSlice.actions;
const { reducer } = destinationSlice;
export default reducer;
