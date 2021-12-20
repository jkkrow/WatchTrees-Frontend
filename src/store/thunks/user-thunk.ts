import axios from 'axios';

import { AppThunk } from 'store';
import { userActions } from 'store/slices/user-slice';
import { History } from 'store/slices/video-slice';
import { uiActions } from 'store/slices/ui-slice';
import { authActions } from 'store/slices/auth-slice';

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

export const fetchChannel = (userId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().auth;

    const client = dispatch(api());
    const currentUserId = userData ? userData._id : '';

    try {
      const { data } = await client.get(`/users/channel/${userId}`, {
        params: { currentUserId },
      });

      return data.channelInfo;
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Failed to load channel info`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

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
        uiActions.setMessage({
          content: `${(err as Error).message}: Failed to load videos`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const fetchHistory = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, getState, api) => {
    const { accessToken } = getState().auth;

    const client = dispatch(api());

    try {
      let data: History[];

      if (accessToken) {
        const response = await client.get('/users/history', {
          params,
          forceUpdate,
          cache: true,
        });

        data = response.data;
      } else {
        const historyStorage = localStorage.getItem('history');

        if (!historyStorage) {
          data = [];
        } else {
          // TODO: Fetch videos based on videoIds from history
          data = JSON.parse(historyStorage);
        }
      }

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load videos`,
        type: 'error',
        timer: 5000,
      });
    }
  };
};

export const fetchFavorites = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.get('/users/favorites', {
        params,
        forceUpdate,
        cache: true,
      });

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load videos`,
        type: 'error',
        timer: 5000,
      });
    }
  };
};

export const fetchSubscribes = (): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.get('/users/subscribes');

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load subscribes`,
        type: 'error',
        timer: 5000,
      });
    }
  };
};

export const subscribeChannel = (userId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.patch(
        `/users/channel/subscribers/${userId}`
      );

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to subscribe`,
        type: 'error',
        timer: 5000,
      });
    }
  };
};

export const addToHistory = (history: History): AppThunk => {
  return async (dispatch, getState, api) => {
    const { refreshToken } = getState().auth;

    const client = dispatch(api());

    try {
      if (refreshToken) {
        await client.patch('/users/history', { history });
      } else {
        const historyStorage = localStorage.getItem('history');

        if (!historyStorage) {
          const histories: History[] = [];

          histories.push(history);
          localStorage.setItem('history', JSON.stringify(histories));
        } else {
          const localHistories: History[] = JSON.parse(historyStorage);

          const existingHistory = localHistories.find(
            (item) => item.video === history.video
          );

          if (existingHistory) {
            existingHistory.progress = history.progress;
            existingHistory.updatedAt = history.updatedAt;
          } else {
            localHistories.push(history);
          }

          localStorage.setItem('history', JSON.stringify(localHistories));
        }
      }
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to add to favorites`,
        type: 'error',
        timer: 3000,
      });
    }
  };
};

export const addToFavorites = (videoId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.patch('/users/favorites', { videoId });

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to add to favorites`,
        type: 'error',
        timer: 5000,
      });
    }
  };
};
