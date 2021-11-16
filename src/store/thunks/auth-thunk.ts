import jwt_decode, { JwtPayload } from 'jwt-decode';

import { AppThunk } from 'store';
import { authActions } from 'store/slices/auth-slice';
import { uiActions } from 'store/slices/ui-slice';

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

      dispatch(authActions.authSuccess());
      dispatch(authActions.setRefreshToken(data.refreshToken));
      dispatch(authActions.setAccessToken(data.accessToken));
      dispatch(authActions.setUserData(data.userData));

      dispatch(
        uiActions.setMessage({
          content: data.message,
          type: 'message',
          timer: 5000,
        })
      );

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      localStorage.setItem('userData', JSON.stringify(data.userData));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(logout());
        }
      });
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
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

      dispatch(authActions.authSuccess());
      dispatch(authActions.setRefreshToken(data.refreshToken));
      dispatch(authActions.setAccessToken(data.accessToken));
      dispatch(authActions.setUserData(data.userData));

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      localStorage.setItem('userData', JSON.stringify(data.userData));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(logout());
        }
      });
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const logout = (): AppThunk => {
  return (dispatch) => {
    dispatch(authActions.setRefreshToken(null));
    dispatch(authActions.setAccessToken(null));
    dispatch(authActions.setUserData(null));

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };
};

export const fetchTokenOnload = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const client = dispatch(api());

    try {
      const { refreshToken } = getState().auth;

      if (!refreshToken) {
        return dispatch(logout());
      }

      const { exp } = jwt_decode<JwtPayload>(refreshToken);
      const expiresIn = (exp as number) * 1000;

      const i = Date.now();
      const j = i + 86400000 * 6;

      if (expiresIn >= i && expiresIn < j) {
        const { data } = await client.get('/auth/refresh-token', {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        dispatch(authActions.setRefreshToken(data.refreshToken));
        dispatch(authActions.setAccessToken(data.accessToken));

        localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      } else if (expiresIn >= j) {
        const { data } = await client.get('/auth/access-token', {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        dispatch(authActions.setAccessToken(data.accessToken));
      } else {
        return dispatch(logout());
      }

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(logout());
        }
      });
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${
            (err as Error).message
          }: Fetching user credential failed. Please reload page or re-signin`,
          type: 'error',
        })
      );
    }
  };
};

export const sendVerification = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/verification', { email });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const checkVerification = (token: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const client = dispatch(api());

    try {
      const { refreshToken } = getState().auth;

      const isLoggedIn = !!refreshToken;

      dispatch(authActions.authRequest());

      const { data } = await client.get(`/auth/verification/${token}`, {
        params: { isLoggedIn },
      });

      dispatch(authActions.authSuccess(data.message));

      if (isLoggedIn && data.refreshToken) {
        dispatch(authActions.setRefreshToken(data.refreshToken));
        dispatch(authActions.setAccessToken(data.accessToken));
        dispatch(authActions.setUserData(data.userData));

        localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
        localStorage.setItem('userData', JSON.stringify(data.userData));
      }
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const sendRecovery = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/recovery', {
        email,
      });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const checkRecovery = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      await client.get(`/auth/recovery/${token}`);

      return true;
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const resetPassword = (
  password: string,
  confirmPassword: string,
  token: string
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.patch(`/auth/recovery/${token}/password`, {
        password,
        confirmPassword,
      });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};
