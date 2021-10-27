import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { AppDispatch } from 'store';
import { authActions } from 'store/reducers/auth';

export const register = (credentials: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/register', credentials);

      dispatch(authActions.authSuccess(data.message));

      return true;
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};

export const login = (
  credentials: { email: string; password: string } | { tokenId: string }
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/login', credentials);

      dispatch(
        authActions.login({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userData: data.userData,
        })
      );

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      localStorage.setItem('userData', JSON.stringify(data.userData));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(authActions.logout());
        }
      });
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};

export const logout = () => {
  return (dispatch: AppDispatch) => {
    dispatch(authActions.logout());

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };
};

export const updateRefreshToken = (refreshToken: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = axios.create();

      axiosRetry(request, {
        retries: 3,
        retryDelay: () => 3000,
      });

      const { data } = await request.get('/auth/refresh-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(authActions.setRefreshToken(data.refreshToken));
      dispatch(authActions.setAccessToken(data.accessToken));

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(authActions.logout());
        }
      });
    } catch (err) {
      // TODO: Display Global Message
      console.log(err);
    }
  };
};

export const updateAccessToken = (refreshToken: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const request = axios.create();

      axiosRetry(request, {
        retries: 3,
        retryDelay: () => 3000,
      });

      const { data } = await request.get('/auth/access-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(authActions.setAccessToken(data.accessToken));
    } catch (err) {
      // TODO: Display Global Message
      console.log(err);
    }
  };
};

export const clearResponse = () => {
  return (dispatch: AppDispatch) => {
    dispatch(authActions.clearResponse());
  };
};

export const sendVerifyEmail = (email: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/send-verify-email', { email });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};

export const verifyEmail = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.get(`/auth/verify-email/${token}`);

      dispatch(authActions.authSuccess(data.message));

      return true;
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};

export const sendRecoveryEmail = (email: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/send-recovery-email', { email });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};

export const getResetPassword = (token: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      await axios.get(`/auth/reset-password/${token}`);

      return true;
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};

export const postResetPassword = (
  password: string,
  confirmPassword: string,
  token: string
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        authActions.authFail(error.response?.data?.message || error.message)
      );
    }
  };
};
