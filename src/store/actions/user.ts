import axios, { AxiosError } from 'axios';

import { AppDispatch, RootState } from 'store';
import { userActions } from 'store/reducers/user';

export const fetchUserVideos = (pageNumber: number) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(userActions.userRequest());

      const { accessToken } = getState().auth;

      const { data } = await axios.get(`/user/videos?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(userActions.userSuccess());

      return { videos: data.videos, totalPage: data.totalPage };
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        userActions.userFail(
          `${error.response?.data?.message || error.message} - Failed to load videos.`
        )
      );
    }
  };
};

export const updateUserData = (info: any) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userActions.setUserData(info));

    const { userData } = getState().user;

    localStorage.setItem('userData', JSON.stringify(userData));
  };
};

export const clearResponse = () => {
  return (dispatch: AppDispatch) => {
    dispatch(userActions.clearResponse());
  };
};
