import axios, { AxiosError } from 'axios';

import { AppDispatch, RootState } from 'store';
import { userActions } from 'store/reducers/user';

export const fetchVideos = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(userActions.userRequest());

      const { accessToken } = getState().auth;

      const { data } = await axios.get('/user/videos', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(userActions.setUserData({ videos: data.videos }));

      return true;
    } catch (err) {
      let error = err as AxiosError;
      dispatch(userActions.userFail(error.response?.data?.message || error.message));
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
