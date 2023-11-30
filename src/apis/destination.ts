import { AnyARecord } from 'dns';
import { TDestination, TDestinationRequest, TFloor, TImportResponse } from 'src/@types/fine/destination';
import { TProduct } from 'src/@types/fine/product';
import { BaseResponse, PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getDestinationList = (params?: any): Promise<BaseResponse<TDestination>> =>
  request
    .get(`/admin/destination`, {
      params: params,
    })
    .then((res) => res.data);
const getFloorList = (destinationId: string): Promise<BaseResponse<TFloor>> =>
  request
    .get(`/floor/destination/${destinationId}`, {
      params: {
        page: 1,
        PageSize: 20
      },
    })
    .then((res) => res.data);
const createDestination = (destinationRequest: TDestinationRequest) =>
  request
    .post<PostResponse<TDestination>>(`/admin/destination`, destinationRequest)
    .then((res) => res.data);
const Test = (excelFile: any) =>
  request
    .post<PostResponse<TImportResponse>>(`/admin/import`, excelFile)
    .then((res) => res);
const updateDestination = (destinationId: any, destinationRequest: any) =>
  request
    .put(`/admin/destination/${destinationId}`, destinationRequest, {})
    .then((res) => res.data);



const destinationApi = {
  getFloorList,
  Test,
  getDestinationList,
  createDestination,
  updateDestination,
};

export default destinationApi;
