import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TMenu } from 'src/@types/fine/menu';
import { BaseResponse } from 'src/@types/request';
import menuApi from 'src/apis/menu';

type TMenuStates = {
  menuList: BaseResponse<TMenu> | null;
  isLoading: boolean;
};
const initialState: TMenuStates = {
  menuList: null,
  isLoading: true,
};

export const getMenuList = createAsyncThunk('menu/getMenuList', async (timeslotId: string) => {
  const response = await menuApi.getMenuList(timeslotId);

  return response;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMenuList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMenuList.fulfilled, (state, action) => {
      state.menuList = action.payload;
      state.isLoading = false;
    });
  },
});
// export const { setCurrentMenu } = menuSlice.actions;
const { reducer } = menuSlice;
export default reducer;
