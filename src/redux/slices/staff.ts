import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TStaff, TStaffRequest } from 'src/@types/fine/staff';
import { BaseResponse } from 'src/@types/request';
import staffApi from 'src/apis/staff';

type TStaffStates = {
  staffRes: BaseResponse<TStaff> | null;
  isLoading: boolean;
};

type TStaffPut = {
  newStaff: TStaffRequest;
  staffId: string;
};

const initialState: TStaffStates = {
  staffRes: null,
  isLoading: true,
};

export const getStaffList = createAsyncThunk('staff/getStaffList', async (params?: any) => {
  const response = await staffApi.getStaffList(params);
  return response;
});

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (newStaff: TStaffRequest) => {
    const response = await staffApi.createStaff(newStaff);
    return response;
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStaffList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStaffList.fulfilled, (state, action) => {
      state.staffRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createStaff.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createStaff.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
// export const {} = staffSlice.actions;
const { reducer } = staffSlice;
export default reducer;
