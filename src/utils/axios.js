import axios from 'axios';

// ----------------------------------------------------------------------

const parseParams = (params) => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray =
      isParamTypeObject && Array.isArray(params[key]) && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_DEV,
  timeout: 60000,
  // with credentials may cause cors policy
  // withCredentials: true,
  // process && process.env.NODE_ENV === "production"
  //   ? process.env.NEXT_PUBLIC_BASE_URL_PROD
  //   : process.env.NEXT_PUBLIC_BASE_URL_DEV,
  paramsSerializer: parseParams,
});

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra')
);

function _createAuthInterceptor(token) {
  return (request) => {
    request.headers = request.headers ?? {};
    request.headers[AUTHORIZATION] = `Bearer ${token}`;
    return request;
  };
}

function setAuthorizationHeader(token) {
  request.interceptors.request.use(_createAuthInterceptor(token));
}

export { request, setAuthorizationHeader };
