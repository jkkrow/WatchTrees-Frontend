import axiosRetry from 'axios-retry';

import { AppDispatch, AppThunk } from 'store';
import { authActions } from 'store/reducers/auth-reducer';
import { loadMessage } from './ui-action';

export const register = (credentials: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/register', credentials);

      dispatch(authActions.authSuccess(data.message));

      return true;
    } catch (err) {
      dispatch(authActions.authFail(`${err}`));
    }
  };
};

export const login = (
  credentials: { email: string; password: string } | { tokenId: string }
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/login', credentials);

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
      dispatch(authActions.authFail(`${err}`));
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

export const updateRefreshToken = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const client = dispatch(api());

    try {
      const { refreshToken } = getState().auth;

      axiosRetry(client, {
        retries: 3,
        retryDelay: () => 3000,
      });

      const { data } = await client.get('/auth/refresh-token', {
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

      return data.refreshToken;
    } catch (err) {
      dispatch(
        loadMessage({
          content: `Fetching user credential failed: ${err}. Please reload page or re-signin`,
          type: 'error',
        })
      );
    }
  };
};

export const updateAccessToken = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const client = dispatch(api());

    try {
      const { refreshToken } = getState().auth;

      axiosRetry(client, {
        retries: 3,
        retryDelay: () => 3000,
      });

      const { data } = await client.get('/auth/access-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(authActions.setAccessToken(data.accessToken));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(authActions.logout());
        }
      });

      return data.accessToken;
    } catch (err) {
      dispatch(
        loadMessage({
          content: `Fetching user credential failed: ${err}. Please reload page or re-signin`,
          type: 'error',
        })
      );
    }
  };
};

export const sendVerifyEmail = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/send-verify-email', { email });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${err}`));
    }
  };
};

export const verifyEmail = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.get(`/auth/verify-email/${token}`);

      dispatch(authActions.authSuccess(data.message));

      return true;
    } catch (err) {
      dispatch(authActions.authFail(`${err}`));
    }
  };
};

export const sendRecoveryEmail = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/send-recovery-email', {
        email,
      });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${err}`));
    }
  };
};

export const getResetPassword = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      await client.get(`/auth/reset-password/${token}`);

      return true;
    } catch (err) {
      dispatch(authActions.authFail(`${err}`));
    }
  };
};

export const postResetPassword = (
  password: string,
  confirmPassword: string,
  token: string
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${err}`));
    }
  };
};

export const clearResponse = () => {
  return (dispatch: AppDispatch) => {
    dispatch(authActions.clearResponse());
  };
};
