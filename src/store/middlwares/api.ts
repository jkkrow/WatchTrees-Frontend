import axios from 'axios';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { AppDispatch, AppState } from 'store';
import { authActions } from 'store/reducers/auth-reducer';

export const api = () => {
  return (dispatch: AppDispatch, getState: () => AppState) => {
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
    });

    axiosInstance.interceptors.request.use(async (req) => {
      const { refreshToken, accessToken } = getState().auth;

      if (!refreshToken || !accessToken) return req;

      const { exp } = jwt_decode<JwtPayload>(accessToken);

      if ((exp as number) * 1000 < Date.now()) {
        const { refreshToken } = getState().auth;
        const request = axios.create();

        const { data } = await request.get('/auth/access-token', {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        dispatch(authActions.setAccessToken(data.accessToken));

        req.headers.Authorization = `Bearer ${data.accessToken}`;

        return req;
      }

      req.headers.Authorization = `Bearer ${accessToken}`;

      return req;
    });

    return axiosInstance;
  };
};

export const cacheData = () => {};
