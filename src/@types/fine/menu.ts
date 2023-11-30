export interface TMenu {
  id: string
  timeSlotId: string
  menuName: string
  imageUrl: string
  position: string
  isActive: boolean
  createAt: string
  updateAt: string
  products: Product[]
}

export interface Product {
  id: string
  storeId: string
  categoryId: string
  productCode: string
  productName: string
  productType: number
  imageUrl: string
  isActive: boolean
  createAt: string
  updateAt: string
  productAttributes: ProductAttribute[]
}

export interface ProductAttribute {
  id: string
  productId: string
  name: string
  code: string
  size: string
  price: number
  isActive: boolean
  rotationType: number
  height: number
  width: number
  length: number
  createAt: string
  updateAt: string
}
export interface TProductInMenu {
  id: string
  productId: string
  productName: string
  menuId: string
  isActive: boolean
  status: number
}
export interface TProductInMenuRequest {
  menuId: string
  productIds: string[]
}
export interface TUpdateProductInMenu {
  status: number
  isActive: boolean
}
