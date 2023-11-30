export type TDestination = {
  id: string;
  name: string;
  code: string;
  lat: string;
  long: string;
  isActive: boolean;
  createAt: string;
  updateAt: string;
};

export type TFloor = {
  id: string
  destionationId: string
  number: number
  isActive: boolean
}

export interface TDestinationRequest {
  name: string;
  lat: string;
  long: string;
  code: string;
}

export interface TImportResponse {
  status: Status
  data: Data
}

export interface Status {
  success: boolean
  message: string
  errorCode: number
}

export interface Data {
  errorLine: number[]
}

