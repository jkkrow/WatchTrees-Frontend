import jwt_decode, { JwtPayload } from 'jwt-decode';
import axios from 'axios';

import { AppThunk } from 'store';
import { userActions } from 'store/slices/user-slice';
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
      dispatch(userActions.userRequest());

      const { data } = await client.post('/users/register', credentials);

      dispatch(
        uiActions.setMessage({
          content: data.message,
          type: 'message',
          timer: 5000,
        })
      );

      dispatch(userActions.userSuccess());
      dispatch(userActions.setRefreshToken(data.refreshToken));
      dispatch(userActions.setAccessToken(data.accessToken));
      dispatch(userActions.setUserData(data.userData));

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      localStorage.setItem('userData', JSON.stringify(data.userData));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(logout());
        }
      });
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
    }
  };
};

export const login = (
  credentials: { email: string; password: string } | { tokenId: string }
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.post('/users/login', credentials);

      dispatch(userActions.userSuccess());
      dispatch(userActions.setRefreshToken(data.refreshToken));
      dispatch(userActions.setAccessToken(data.accessToken));
      dispatch(userActions.setUserData(data.userData));

      localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      localStorage.setItem('userData', JSON.stringify(data.userData));

      window.addEventListener('storage', (event) => {
        if (event.key !== 'refreshToken') return;

        if (event.oldValue && !event.newValue) {
          dispatch(logout());
        }
      });
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
    }
  };
};

export const logout = (): AppThunk => {
  return (dispatch) => {
    dispatch(userActions.setRefreshToken(null));
    dispatch(userActions.setAccessToken(null));
    dispatch(userActions.setUserData(null));

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };
};

export const fetchTokenOnload = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const client = dispatch(api());

    try {
      const { refreshToken } = getState().user;

      if (!refreshToken) {
        return dispatch(logout());
      }

      const { exp } = jwt_decode<JwtPayload>(refreshToken);
      const expiresIn = (exp as number) * 1000;

      const i = Date.now();
      const j = i + 86400000 * 6;

      if (expiresIn >= i && expiresIn < j) {
        const { data } = await client.get('/users/refresh-token', {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        dispatch(userActions.setRefreshToken(data.refreshToken));
        dispatch(userActions.setAccessToken(data.accessToken));

        localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
      } else if (expiresIn >= j) {
        const { data } = await client.get('/users/access-token', {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        dispatch(userActions.setAccessToken(data.accessToken));
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
      throw err;
    }
  };
};

export const sendVerification = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.post('/users/verification', { email });

      dispatch(userActions.userSuccess(data.message));
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
    }
  };
};

export const checkVerification = (token: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const client = dispatch(api());

    try {
      const { refreshToken } = getState().user;

      const isLoggedIn = !!refreshToken;

      dispatch(userActions.userRequest());

      const { data } = await client.get(`/users/verification/${token}`, {
        params: { isLoggedIn },
      });

      dispatch(userActions.userSuccess(data.message));

      if (isLoggedIn && data.refreshToken) {
        dispatch(userActions.setRefreshToken(data.refreshToken));
        dispatch(userActions.setAccessToken(data.accessToken));
        dispatch(userActions.setUserData(data.userData));

        localStorage.setItem('refreshToken', JSON.stringify(data.refreshToken));
        localStorage.setItem('userData', JSON.stringify(data.userData));
      }
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
    }
  };
};

export const sendRecovery = (email: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.post('/users/recovery', {
        email,
      });

      dispatch(userActions.userSuccess(data.message));
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
    }
  };
};

export const checkRecovery = (token: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      await client.get(`/users/recovery/${token}`);

      dispatch(userActions.userSuccess());
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
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
      dispatch(userActions.userRequest());

      const { data } = await client.patch(`/users/recovery/${token}/password`, {
        password,
        confirmPassword,
      });

      dispatch(userActions.userSuccess(data.message));
    } catch (err) {
      dispatch(userActions.userFail(`${(err as Error).message}`));
      throw err;
    }
  };
};

export const updateUserName = (name: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().user;

    if (!userData) return;

    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.patch('users/name', {
        name,
      });

      dispatch(userActions.userSuccess());
      dispatch(
        uiActions.setMessage({
          type: 'message',
          content: data.message,
          timer: 5000,
        })
      );

      const newUserData = { ...userData, name };

      dispatch(userActions.setUserData(newUserData));

      localStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (err) {
      dispatch(
        userActions.userFail(
          `${(err as Error).message}: Failed to update user name`
        )
      );
      throw err;
    }
  };
};

export const updateUserPassword = (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.patch('users/password', {
        ...payload,
      });

      dispatch(userActions.userSuccess());
      dispatch(
        uiActions.setMessage({
          type: 'message',
          content: data.message,
          timer: 5000,
        })
      );
    } catch (err) {
      dispatch(
        userActions.userFail(
          `${(err as Error).message}: Failed to update password`
        )
      );
      throw err;
    }
  };
};

export const updateUserPicture = (file: File | null): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().user;

    if (!userData) return;

    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const isNewFile = !!file;

      const { data } = await client.patch('users/picture', {
        isNewFile,
        fileType: file ? file.type : null,
      });

      if (file) {
        await axios.put(data.presignedUrl, file, {
          headers: { 'Content-Type': file.type },
        });
      }

      dispatch(userActions.userSuccess());
      dispatch(
        uiActions.setMessage({
          type: 'message',
          content: data.message,
          timer: 5000,
        })
      );

      const newUserData = { ...userData, picture: data.newPicture };

      dispatch(userActions.setUserData(newUserData));

      localStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (err) {
      dispatch(
        userActions.userFail(
          `${(err as Error).message}: Failed to update picture`
        )
      );
      throw err;
    }
  };
};

export const fetchChannelInfo = (userId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().user;

    const client = dispatch(api());
    const currentUserId = userData ? userData._id : '';

    try {
      const response = await client.get(`/users/channel/${userId}`, {
        params: { currentUserId },
      });

      const { channelInfo } = response.data;

      return channelInfo;
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Failed to load channel info`,
          type: 'error',
          timer: 5000,
        })
      );
      throw err;
    }
  };
};

export const fetchSubscribes = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const response = await client.get('/users/subscribes', {
        params,
        forceUpdate,
        cache: true,
      });

      const { subscribes } = response.data;

      return subscribes;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load subscribes`,
        type: 'error',
        timer: 5000,
      });
      throw err;
    }
  };
};

export const toggleSubscribe = (userId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.patch(`/users/subscribes/${userId}`);

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to subscribe`,
        type: 'error',
        timer: 5000,
      });
      throw err;
    }
  };
};
