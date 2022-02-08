import { useCallback, useState, useRef, useEffect } from 'react';
import axios, { AxiosAdapter, AxiosError, AxiosRequestConfig } from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { authActions } from 'store/slices/auth-slice';
import { useAppDispatch, useAppSelector } from './store-hook';
import { uiActions } from 'store/slices/ui-slice';

type NonUndefined<T> = T extends undefined ? never : T;

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, {
    enabledByDefault: false,
  }),
});

export const useApi = () => {
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  axiosInstance.interceptors.request.use(async (req) => {
    if (!refreshToken || !accessToken) return req;

    const { exp } = jwt_decode<JwtPayload>(accessToken);

    if ((exp as number) * 1000 < Date.now()) {
      const { data } = await axios.get('/users/access-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(authActions.setAccessToken(data.accessToken));

      req.headers.Authorization = `Bearer ${data.accessToken}`;

      return req;
    }

    req.headers.Authorization = `Bearer ${accessToken}`;

    return req;
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      let axiosError: AxiosError | undefined;

      if (err.response) {
        axiosError = err.response.data;
      }

      return Promise.reject(axiosError || err);
    }
  );

  return axiosInstance;
};

export const useClient = <T = any>(
  initialData?: T,
  options: { errorMessage?: boolean | string } = { errorMessage: true }
) => {
  const [data, setData] = useState(initialData as NonUndefined<T>);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnmounted = useRef(false);
  const api = useApi();

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  const dispatch = useAppDispatch();

  const dispatchThunk = useCallback(
    async (url: string, config?: AxiosRequestConfig) => {
      try {
        setLoading(true);

        const { data } = await api(url, config);

        if (isUnmounted.current) {
          return;
        }

        data && setData(data);
        setLoading(false);
        setLoaded(true);
      } catch (err) {
        setLoading(false);
        setLoaded(true);
        setError((err as Error).message);

        if (options.errorMessage) {
          const msg =
            typeof options.errorMessage === 'string'
              ? `: ${options.errorMessage}`
              : '';

          dispatch(
            uiActions.setMessage({
              type: 'error',
              content: (err as Error).message + msg,
            })
          );
        }

        throw err;
      }
    },
    [dispatch, options.errorMessage, api]
  );

  return { dispatchThunk, setData, data, loading, loaded, error };
};
