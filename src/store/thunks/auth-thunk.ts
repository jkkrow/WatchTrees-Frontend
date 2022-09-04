import jwtDecode, { JwtPayload } from 'jwt-decode';

import { AppThunk } from 'store';
import { authActions } from 'store/slices/auth-slice';

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

    return data;
  };
};

export const signin = (
  credentials: { email: string; password: string } | { tokenId: string }
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/signin', credentials);

    dispatch(authActions.signin(data));

    return data;
  };
};

export const setAuthOnload = (): AppThunk => {
  return async (dispatch, getState) => {
    const { refreshToken } = getState().auth;

    if (!refreshToken) {
      dispatch(authActions.signout());
      return false;
    }

    const { exp } = jwtDecode<JwtPayload>(refreshToken);
    const expiresIn = (exp as number) * 1000;

    const i = Date.now(); // now
    const j = i + 86400000 * 6; // 6 days later
    let isLoggedIn: boolean;

    if (expiresIn >= i && expiresIn < j) {
      await dispatch(updateRefreshToken(refreshToken));
      isLoggedIn = true;
    } else if (expiresIn >= j) {
      await dispatch(updateAccessToken(refreshToken));
      isLoggedIn = true;
    } else {
      // Refresh token expired
      dispatch(authActions.signout());
      isLoggedIn = false;
    }
    return isLoggedIn;
  };
};

export const updateRefreshToken = (refreshToken: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.get('/users/refresh-token', {
      headers: { Authorization: 'Bearer ' + refreshToken },
    });

    dispatch(authActions.setRefreshToken(data.refreshToken));
    dispatch(authActions.setAccessToken(data.accessToken));

    return data;
  };
};

export const updateAccessToken = (refreshToken: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.get('/users/access-token', {
      headers: { Authorization: 'Bearer ' + refreshToken },
    });

    dispatch(authActions.setAccessToken(data.accessToken));

    return data;
  };
};

export const sendVerification = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/verification', { email });

    return data;
  };
};

export const checkVerification = (token: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;
    const client = dispatch(api());

    const { data } = await client.get(`/users/verification/${token}`);

    userData && dispatch(authActions.setVerified());

    return data;
  };
};

export const sendRecovery = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/recovery', { email });

    return data;
  };
};

export const checkRecovery = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.get(`/users/recovery/${token}`);

    return data;
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

    return data;
  };
};

export const deleteAccount = (
  credentials: { email: string; password: string } | { tokenId: string }
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.post('/users/deletion', credentials);

    return data;
  };
};
