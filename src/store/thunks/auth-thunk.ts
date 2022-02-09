import jwt_decode, { JwtPayload } from 'jwt-decode';

import { AppThunk } from 'store';
import { authActions } from 'store/slices/auth-slice';
import { uiActions } from 'store/slices/ui-slice';

export const signup = (credentials: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/signup', credentials);

    dispatch(authActions.signin(data));
    dispatch(
      uiActions.setMessage({
        content: data.message,
        type: 'message',
        timer: 5000,
      })
    );
  };
};

export const signin = (
  credentials: { email: string; password: string } | { tokenId: string }
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/signin', credentials);

    dispatch(authActions.signin(data));
  };
};

export const setAuthOnload = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const { refreshToken } = getState().auth;

    if (!refreshToken) {
      return dispatch(authActions.signout());
    }

    const client = dispatch(api());

    const { exp } = jwt_decode<JwtPayload>(refreshToken);
    const expiresIn = (exp as number) * 1000;

    const i = Date.now();
    const j = i + 86400000 * 6;

    if (expiresIn >= i && expiresIn < j) {
      const { data } = await client.get('/users/refresh-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(authActions.setRefreshToken(data.refreshToken));
      dispatch(authActions.setAccessToken(data.accessToken));
    } else if (expiresIn >= j) {
      const { data } = await client.get('/users/access-token', {
        headers: { Authorization: 'Bearer ' + refreshToken },
      });

      dispatch(authActions.setAccessToken(data.accessToken));
    } else {
      return dispatch(authActions.signout());
    }
  };
};

export const sendVerification = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/verification', { email });

    return data.message;
  };
};

export const checkVerification = (token: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;
    const client = dispatch(api());

    const { data } = await client.get(`/users/verification/${token}`);

    userData && dispatch(authActions.setVerified());

    return data.message;
  };
};

export const sendRecovery = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/recovery', { email });

    return data.message;
  };
};

export const checkRecovery = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    await client.get(`/users/recovery/${token}`);
  };
};

export const resetPassword = (
  password: string,
  confirmPassword: string,
  token: string
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.patch(`/users/recovery/${token}/password`, {
      password,
      confirmPassword,
    });

    return data.message;
  };
};
