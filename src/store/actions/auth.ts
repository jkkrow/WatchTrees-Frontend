import axios from 'axios';
import axiosRetry from 'axios-retry';

import { authActions } from 'store/reducers/auth';

export const register = (credentials, cb) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/register', credentials);

      dispatch(
        authActions.authSuccess({
          message: data.message,
        })
      );

      cb();
    } catch (err) {
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const login = (credentials) => {
  return async (dispatch) => {
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
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(authActions.logout());

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };
};

export const updateRefreshToken = (refreshToken) => {
  return async (dispatch) => {
    try {
      axiosRetry(axios, {
        retries: 3,
        retryDelay: () => 3000,
      });

      const { data } = await axios.get('/auth/refresh-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(
        authActions.setRefreshToken({ refreshToken: data.refreshToken })
      );
      dispatch(authActions.setAccessToken({ accessToken: data.accessToken }));

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(authActions.logout());
        }
      });
    } catch (err) {
      // Display Global Message
      console.log(err);
    }
  };
};

export const updateAccessToken = (refreshToken) => {
  return async (dispatch) => {
    try {
      axiosRetry(axios, {
        retries: 3,
        retryDelay: () => 3000,
      });

      const { data } = await axios.get('/auth/access-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(
        authActions.setAccessToken({
          accessToken: data.accessToken,
        })
      );
    } catch (err) {
      // Display Global Message
      console.log(err);
    }
  };
};

export const clearResponse = () => {
  return (dispatch) => {
    dispatch(authActions.clearResponse());
  };
};

export const verifyEmail = (token, cb) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.get(`/auth/verify-email/${token}`);

      dispatch(
        authActions.authSuccess({
          message: data.message,
        })
      );

      cb();
    } catch (err) {
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const sendVerifyEmail = (email) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/send-verify-email', { email });

      dispatch(
        authActions.authSuccess({
          message: data.message,
        })
      );
    } catch (err) {
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const sendRecoveryEmail = (email) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.post('/auth/send-recovery-email', { email });

      dispatch(authActions.authSuccess({ message: data.message }));
    } catch (err) {
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const getResetPassword = (token, cb) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      await axios.get(`/auth/reset-password/${token}`);

      cb();
    } catch (err) {
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const postResetPassword = (password, confirmPassword, token) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.authRequest());

      const { data } = await axios.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      dispatch(authActions.authSuccess({ message: data.message }));
    } catch (err) {
      dispatch(
        authActions.authFail({
          error:
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message,
        })
      );
    }
  };
};

export const updateUserData = (info) => {
  return (dispatch) => {
    dispatch(authActions.setUserData({ info }));

    const prevUserData = JSON.parse(localStorage.getItem('userData'));

    const newUserData = {
      ...prevUserData,
      ...info,
    };

    localStorage.setItem('userData', JSON.stringify(newUserData));
  };
};
