export interface TStore {
  id: string;
  destinationId: string;
  storeName: string;
  imageUrl: string;
  contactPerson: string;
  isActive: boolean;
}

export interface TStoreRequest {
  destinationId?: string;
  storeName?: string;
  imageUrl?: string;
  contactPerson?: string;
  isActive?: boolean;

}
export interface TUpdateStoreRespones {
  status: Status
  data: any
}

export interface Status {
  success: boolean
  message: string
  errorCode: number
}

// export interface TStoreRequestUpdate {
//   storeId: string;
//   destinationId: string;
//   storeName: string;
//   imageUrl: string;
//   contactPerson: string;
//   isActive: boolean;

// }
