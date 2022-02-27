import axios from 'axios';

import { AppThunk } from 'store';
import { userActions } from 'store/slices/user-slice';

export const updateUserName = (name: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData!;
    const client = dispatch(api());

    const { data } = await client.patch('users/name', {
      name,
    });

    dispatch(userActions.setUserData({ ...userData, name }));

    return data;
  };
};

export const updateUserPassword = (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.patch('users/password', { ...payload });

    return data;
  };
};

export const updateUserPicture = (file: File | null): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData!;
    const client = dispatch(api());

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

    dispatch(userActions.setUserData({ ...userData, picture: data.picture }));

    return data;
  };
};

export const fetchChannel = (channelId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;
    const userId = userData ? userData._id : '';
    const client = dispatch(api());

    const response = await client.get(`/users/${channelId}/channel`, {
      params: { userId },
    });

    const { channel } = response.data;

    return channel;
  };
};

export const fetchChannels = (params?: any): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const response = await client.get('/users/channel', { params });

    const { channels, count } = response.data;

    return { channels, count };
  };
};

export const fetchSubscribes = (params?: any): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const response = await client.get('/users/subscribes', { params });

    const { channels, count } = response.data;

    return { channels, count };
  };
};

export const fetchSubscribers = (params?: any): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const response = await client.get('/users/subscribers', { params });

    const { channels, count } = response.data;

    return { channels, count };
  };
};

export const toggleSubscribe = (channelId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const { data } = await client.patch(`/users/${channelId}/subscribers`);

    return data;
  };
};
