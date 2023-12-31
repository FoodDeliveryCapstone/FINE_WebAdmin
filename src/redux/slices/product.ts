import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// utils
import { request } from '../../utils/axios';
import { CartItem, Product } from '../../@types/product';
//
import { dispatch } from '../store';
import axios from 'axios';
import productApi from 'src/apis/product';
import { BaseResponse } from 'src/@types/request';
import { TProduct, TProductReport } from 'src/@types/fine/product';

// ----------------------------------------------------------------------

type ProductState = {
  productRes: BaseResponse<TProduct> | null;
  productReportRes: BaseResponse<TProductReport> | null;
  isLoading: boolean;
};




const initialState: ProductState = {
  isLoading: false,
  productRes: null,
  productReportRes: null,
  // products: [],
  // product: null,
  // sortBy: null,
  // filters: {
  //   gender: [],
  //   category: 'All',
  //   colors: [],
  //   priceRange: '',
  //   rating: '',
  // },
  // checkout: {
  //   activeStep: 0,
  //   cart: [],
  //   subtotal: 0,
  //   total: 0,
  //   discount: 0,
  //   shipping: 0,
  //   billing: null,
  // },
};

export const getProductList = createAsyncThunk('product/product', async (page?: number) => {
  const response = await productApi.getProductList(page);

  return response;
});
export const getProductListReport = createAsyncThunk('product/productReport', async (page?: number) => {
  const response = await productApi.getProductListReport(page);

  return response;
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.productRes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getProductListReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductListReport.fulfilled, (state, action) => {
      state.productReportRes = action.payload;
      state.isLoading = false;
    });
  },
});
// export const {} = storeSlice.actions;
const { reducer } = productSlice;
export default reducer;

// const slice = createSlice({
//   name: 'product',
//   initialState,
//   reducers: {
//     // START LOADING
//     startLoading(state) {
//       state.isLoading = true;
//     },

//     // HAS ERROR
//     hasError(state, action) {
//       state.isLoading = false;
//       state.error = action.payload;
//     },

//     // GET PRODUCTS
//     getProductsSuccess(state, action) {
//       state.isLoading = false;
//       state.products = action.payload;
//     },

//     // GET PRODUCT
//     getProductSuccess(state, action) {
//       state.isLoading = false;
//       state.product = action.payload;
//     },

//     //  SORT & FILTER PRODUCTS
//     sortByProducts(state, action) {
//       state.sortBy = action.payload;
//     },

//     filterProducts(state, action) {
//       state.filters.gender = action.payload.gender;
//       state.filters.category = action.payload.category;
//       state.filters.colors = action.payload.colors;
//       state.filters.priceRange = action.payload.priceRange;
//       state.filters.rating = action.payload.rating;
//     },

//     // CHECKOUT
//     getCart(state, action) {
//       const cart = action.payload;

//       const subtotal = sum(cart.map((cartItem: CartItem) => cartItem.price * cartItem.quantity));
//       const discount = cart.length === 0 ? 0 : state.checkout.discount;
//       const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
//       const billing = cart.length === 0 ? null : state.checkout.billing;

//       state.checkout.cart = cart;
//       state.checkout.discount = discount;
//       state.checkout.shipping = shipping;
//       state.checkout.billing = billing;
//       state.checkout.subtotal = subtotal;
//       state.checkout.total = subtotal - discount;
//     },

//     addCart(state, action) {
//       const product = action.payload;
//       const isEmptyCart = state.checkout.cart.length === 0;

//       if (isEmptyCart) {
//         state.checkout.cart = [...state.checkout.cart, product];
//       } else {
//         state.checkout.cart = state.checkout.cart.map((_product) => {
//           const isExisted = _product.id === product.id;
//           if (isExisted) {
//             return {
//               ..._product,
//               quantity: _product.quantity + 1,
//             };
//           }
//           return _product;
//         });
//       }
//       state.checkout.cart = uniqBy([...state.checkout.cart, product], 'id');
//     },

//     deleteCart(state, action) {
//       const updateCart = state.checkout.cart.filter((item) => item.id !== action.payload);

//       state.checkout.cart = updateCart;
//     },

//     resetCart(state) {
//       state.checkout.activeStep = 0;
//       state.checkout.cart = [];
//       state.checkout.total = 0;
//       state.checkout.subtotal = 0;
//       state.checkout.discount = 0;
//       state.checkout.shipping = 0;
//       state.checkout.billing = null;
//     },

//     onBackStep(state) {
//       state.checkout.activeStep -= 1;
//     },

//     onNextStep(state) {
//       state.checkout.activeStep += 1;
//     },

//     onGotoStep(state, action) {
//       const goToStep = action.payload;
//       state.checkout.activeStep = goToStep;
//     },

//     increaseQuantity(state, action) {
//       const productId = action.payload;
//       const updateCart = state.checkout.cart.map((product) => {
//         if (product.id === productId) {
//           return {
//             ...product,
//             quantity: product.quantity + 1,
//           };
//         }
//         return product;
//       });

//       state.checkout.cart = updateCart;
//     },

//     decreaseQuantity(state, action) {
//       const productId = action.payload;
//       const updateCart = state.checkout.cart.map((product) => {
//         if (product.id === productId) {
//           return {
//             ...product,
//             quantity: product.quantity - 1,
//           };
//         }
//         return product;
//       });

//       state.checkout.cart = updateCart;
//     },

//     createBilling(state, action) {
//       state.checkout.billing = action.payload;
//     },

//     applyDiscount(state, action) {
//       const discount = action.payload;
//       state.checkout.discount = discount;
//       state.checkout.total = state.checkout.subtotal - discount;
//     },

//     applyShipping(state, action) {
//       const shipping = action.payload;
//       state.checkout.shipping = shipping;
//       state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
//     },
//   },
// });

// Reducer
// export default slice.reducer;

// Actions
// export const {
//   getCart,
//   addCart,
//   resetCart,
//   onGotoStep,
//   onBackStep,
//   onNextStep,
//   deleteCart,
//   createBilling,
//   applyShipping,
//   applyDiscount,
//   increaseQuantity,
//   decreaseQuantity,
//   sortByProducts,
//   filterProducts,
// } = slice.actions;

// ----------------------------------------------------------------------

// export function getProducts() {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response: { data: { products: Product[] } } = await axios.get(`/admin/product`)
//       dispatch(slice.actions.getProductsSuccess(response.data.products));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getProduct(name: string) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response: { data: { product: Product } } = await request.get('/admin/product', {
//         params: { name },
//       });
//       dispatch(slice.actions.getProductSuccess(response.data.product));
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
