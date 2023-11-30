export type BaseReponse<T> = {
  data: T[];
  metadata: {
    page: number;
    size: number;
    total: number;
  };
};

export type ErrorResponse = {
  message: string;
  errorCode: number;
  statusCode: number;
  
};
