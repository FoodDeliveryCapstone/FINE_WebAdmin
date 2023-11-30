import { TAuth } from 'src/@types/fine/auth';
import { PostResponse } from 'src/@types/request';
import { request } from 'src/utils/axios';

const login = (username: string, password: string) =>
  request.post<PostResponse<TAuth>>('/staff/login', {
    username,
    password,
  });
const authenticate = (accessToken: string) => {
  const auth = {
    idToken: accessToken,
  };
  return request.post<PostResponse<TAuth>>(`/customer/login`, auth);
};

const authApi = {
  login,
  authenticate,
};

export default authApi;
