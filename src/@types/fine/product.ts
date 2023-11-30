export interface TProduct {
  id: string;
  storeId: string;
  categoryId: string;
  productCode: string;
  productName: string;
  productType: number;
  imageUrl: string;
  isActive: boolean;
  createAt: string;
  updateAt: string;
  productAttributes: TProductAttribute[];
}
export interface TProductRequest {
  storeId: string;
  categoryId: string;
  productCode: string;
  productName: string;
  productType: number;
  imageUrl: string;
  isStackable: boolean;
  productAttribute: TProductAttribute[];
}
export interface TProductReport {
  storeName: string
  products: Product[]
}

export interface Product {
  storeName: string
  productAttributeId: string
  productName: string
}

export interface TProductAttribute {
  id: string;
  productId: string;
  name: string;
  code: string;
  size: string;
  price: number;
  isActive: boolean;
  createAt: string;
  updateAt: string;

}
export interface TProductReportRequest {
  isActive: boolean;
}
export interface TImportFileRequest {
  excelPath: string;
}

