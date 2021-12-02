import axios from 'axios';

import { AppThunk } from 'store';
import { userActions } from 'store/slices/user-slice';
import { uiActions } from 'store/slices/ui-slice';
import { authActions } from 'store/slices/auth-slice';

export const fetchMyVideos = (
  params?: any,
  forceUpdate: boolean = true
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.get('/videos/user', {
        params,
        forceUpdate,
        cache: true,
      });

      dispatch(userActions.userSuccess());

      return data;
    } catch (err) {
      dispatch(
        userActions.userFail(`${(err as Error).message}: Failed to load videos`)
      );
    }
  };
};

export const updateUserName = (name: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().auth;

    if (!userData) return;

    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.patch('users/account/name', {
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

      dispatch(authActions.setUserData(newUserData));

      localStorage.setItem('userData', JSON.stringify(newUserData));

      return true;
    } catch (err) {
      dispatch(
        userActions.userFail(
          `${(err as Error).message}: Failed to update user name`
        )
      );
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

      const { data } = await client.patch('users/account/password', {
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

      return true;
    } catch (err) {
      dispatch(
        userActions.userFail(
          `${(err as Error).message}: Failed to update password`
        )
      );
    }
  };
};

export const updateUserPicture = (file: File | null): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().auth;

    if (!userData) return;

    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const isNewFile = !!file;

      const { data } = await client.patch('users/account/picture', {
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

      dispatch(authActions.setUserData(newUserData));

      localStorage.setItem('userData', JSON.stringify(newUserData));

      return true;
    } catch (err) {
      dispatch(
        userActions.userFail(
          `${(err as Error).message}: Failed to update picture`
        )
      );
    }
  };
};
