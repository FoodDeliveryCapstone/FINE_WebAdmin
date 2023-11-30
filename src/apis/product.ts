import { TImportFileRequest, TProduct, TProductReport, TProductReportRequest, TProductRequest } from 'src/@types/fine/product';
import { BaseResponse, PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const getProductList = (page?: number): Promise<BaseResponse<TProduct>> =>
  request
    .get(`admin/product`, {
      params: {
        page: page,
      },
    })
    .then((res) => res.data);
const getProductListReport = (page?: number): Promise<BaseResponse<TProductReport>> =>
  request
    .get(`admin/product/reportProduct`, {
      params: {
        page: page,
      },
    })
    .then((res) => res.data);
const getProductAttributesId = (productAttributeId: string): Promise<BaseResponse<TProduct>> =>
  request
    .get(`admin/product/productAttributeId`, {
      params: {
        productAttributeId: productAttributeId,
      },
    })
    .then((res) => res.data);

const createProduct = (productRequest: TProductRequest) =>
  request
    .post<PostResponse<TProduct>>(`/admin/product`, {
      ...productRequest,
    })
    .then((res) => res.data);
const updateProductReport = (productId: string): Promise<BaseResponse<TProductReportRequest>> =>
  request
    .put(`/admin/product/reportProduct/${productId}?isAvailable=true`, {

    })
    .then((res) => res.data);
const importFileProduct = (productRequest: TImportFileRequest) =>
  request
    .post<PostResponse<TProduct>>(`/admin/import`, {
      ...productRequest,
    })
    .then((res) => res.data);
const productApi = {
  importFileProduct,
  createProduct,
  updateProductReport,
  getProductAttributesId,
  getProductList,
  getProductListReport,
};

export default productApi;
