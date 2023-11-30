import { TOrder } from 'src/@types/fine/order';
import { TStaff, TStaffRequest } from 'src/@types/fine/staff';
import { BaseResponse, PostResponse, SingleResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getStaffList = (params?: any): Promise<BaseResponse<TStaff>> =>
  request
    .get(`admin/staff`, {
      params: params,
    })
    .then((res) => res.data);
const updateStaff = (staffId: any, UpdateStaffRequest: TStaffRequest) =>
  request
    .put(`/admin/staff/${staffId}`, UpdateStaffRequest, {})
    .then((res) => res.data);

const authorizeStaff = (): Promise<SingleResponse<TStaff>> =>
  request.get(`admin/staff/authorization`).then((res) => res.data);
const createStaff = (staffRequest: TStaffRequest) =>
  request
    .post<PostResponse<TStaff>>(`/admin/staff`, staffRequest)
    .then((res) => res.data);

const staffApi = {
  updateStaff,
  authorizeStaff,
  getStaffList,
  createStaff,
};

export default staffApi;
