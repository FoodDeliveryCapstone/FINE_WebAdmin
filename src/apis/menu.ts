import { TMenu, TProductInMenu, TProductInMenuRequest, TUpdateProductInMenu } from 'src/@types/fine/menu';
import { BaseResponse, PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';


const getMenuList = (timeslotId?: string): Promise<BaseResponse<TMenu>> =>
  request
    .get(`admin/menu/timeslot/${timeslotId}`)
    .then((res) => res.data);

const createMenu = (menuRequest: TMenu) =>
  request
    .post<PostResponse<TMenu>>(`/admin/menu`, {
      ...menuRequest,
    })
    .then((res) => res.data);


const updateMenu = (menuId: any, UpdateMenuRequest: any) =>
  request
    .put(`/admin/menu/${menuId}`, UpdateMenuRequest, {})
    .then((res) => res.data);

const getProductinMenu = (menuId?: string): Promise<BaseResponse<TProductInMenu>> =>
  request
    .get(`admin/productInMenu/${menuId}`)
    .then((res) => res.data);

const addProductInMenu = (productInMenuRequest: TProductInMenuRequest) =>
  request
    .post<PostResponse<TProductInMenu>>(`/admin/productInMenu`, {
      ...productInMenuRequest,
    })
    .then((res) => res.data);


const updateProductInMenu = (productInMenuId: any, UpdateProductInMenuRequest: TUpdateProductInMenu) =>
  request
    .put(`/admin/productInMenu/${productInMenuId}`, UpdateProductInMenuRequest, {})
    .then((res) => res.data);

const menuApi = {
  getProductinMenu,
  addProductInMenu,
  updateProductInMenu,
  createMenu,
  getMenuList,
  updateMenu
};

export default menuApi;
