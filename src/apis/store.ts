import { TStore, TStoreRequest, TUpdateStoreRespones } from 'src/@types/fine/store';
import { BaseResponse, PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getStoreList = (params?: any): Promise<BaseResponse<TStore>> =>
  request
    .get(`admin/store`, {
      ...params,
    })
    .then((res) => res.data);
const createStore = (storeRequest: TStoreRequest) =>
  request
    .post<PostResponse<TStore>>(`/admin/store`, {
      ...storeRequest,
    })
    .then((res) => res.data);

const updateStore = (storeId: any, UpdateStoreRequest: TStoreRequest) =>
  request
    .put(`/admin/store/${storeId}`, UpdateStoreRequest, {})
    .then((res) => res.data);


const storeApi = {
  getStoreList,
  createStore,
  updateStore,
};

export default storeApi;
