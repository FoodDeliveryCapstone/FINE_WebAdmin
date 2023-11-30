import { TCustomer } from 'src/@types/fine/customer';
import { BaseResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getCustomerList = (page?: number): Promise<BaseResponse<TCustomer>> =>
  request
    .get(`/admin/customer`, {
      params: {
        page: page,
      },
    })
    .then((res) => res.data);

const customerApi = {
  getCustomerList,
};

export default customerApi;
