export type BaseResponse<T> = {
  data: T[];
  metadata: {
    page: number;
    size: number;
    total: number;
  };
  isError: boolean;
  message: string;
};
export type SingleResponse<T> = {
  data: T;
  metadata: {
    page: number;
    size: number;
    total: number;
  };
  isError: boolean;
  message: string;
};
export type PostResponse<T> = {
  data: T;
  status: {
    success: boolean;
    message: string;
    errorCode: number;
  };
};
export type PutResponse<T> = {
  data: T;
  status: {
    success: boolean;
    message: string;
    errorCode: number;
  };
};


export type TErrorResponse = {
  statusCode: number;
  errorCode: number;
  message: string;
};
