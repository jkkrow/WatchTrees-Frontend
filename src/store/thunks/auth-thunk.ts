import jwt_decode, { JwtPayload } from 'jwt-decode';

import { AppThunk } from 'store';
import { authActions } from 'store/reducers/auth-reducer';
import { uiActions } from 'store/reducers/ui-reducer';

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
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const logout = (): AppThunk => {
  return (dispatch) => {
    dispatch(authActions.logout());

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

export const sendVerifyEmail = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      const { data } = await client.post('/auth/send-verify-email', { email });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
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
      dispatch(authActions.authFail(`${(err as Error).message}`));
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
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};

export const getResetPassword = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(authActions.authRequest());

      await client.get(`/auth/user-password/${token}`);

      return true;
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
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

      const { data } = await client.patch(`/auth/user-password/${token}`, {
        password,
        confirmPassword,
      });

      dispatch(authActions.authSuccess(data.message));
    } catch (err) {
      dispatch(authActions.authFail(`${(err as Error).message}`));
    }
  };
};
