import { TTransaction, TTransactionRefund } from 'src/@types/fine/transaction';
import { BaseResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getTransaction = (params?: any): Promise<BaseResponse<TTransaction>> =>
    request
        .get(`/admin/transaction`, {
            params: params,
        })
        .then((res) => res.data);
const getTransactionRefund = (params?: any): Promise<BaseResponse<TTransactionRefund>> =>
    request
        .get(`/admin/transaction/refundTransaction`, {
            params: params,
        })
        .then((res) => res.data);


// const updateDestination = (destinationRequest: TDestinationRequest, destinationId: string) =>
//     request
//         .put<PostResponse<TDestination>>(`/admin/destination/${destinationRequest}`, {
//             params: { ...destinationRequest, id: destinationId },
//         })
//         .then((res) => res.data);

const transactionApi = {
    getTransaction,
    getTransactionRefund,
};

export default transactionApi;
