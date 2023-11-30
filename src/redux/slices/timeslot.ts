import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TTimeSlot } from 'src/@types/fine/timeslot';
import { BaseResponse } from 'src/@types/request';
import timeslotApi from 'src/apis/timeslot';

type TTimeSlotStates = {
  timeSlotRes: BaseResponse<TTimeSlot> | null | undefined;
  isLoading: boolean;
};
const initialState: TTimeSlotStates = {
  isLoading: true,
  timeSlotRes: null
};

export const getTimeSlotList = createAsyncThunk(
  'timeslot/getTimeSlotList',
  async (destinationId: string) => {
    const response = await timeslotApi.getTimeslotList(destinationId);

    return response;
  }
);

const timeSlotSlice = createSlice({
  name: 'timeslot',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTimeSlotList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTimeSlotList.fulfilled, (state, action) => {
      state.timeSlotRes = action.payload;
      state.isLoading = false;
    });
  },
});
// export const {} = timeSlotSlice.actions;
const { reducer } = timeSlotSlice;
export default reducer;
