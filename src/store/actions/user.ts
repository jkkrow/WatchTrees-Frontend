import axios from 'axios';

import { AppDispatch, RootState } from 'store';
import { userActions } from 'store/reducers/user';

export const fetchVideos = (accessToken: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(userActions.userRequest());

      const { data } = await axios.get('/user/videos', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(userActions.setVideos(data.videos));

      return true;
    } catch (err) {}
  };
};

export const updateUserData = (info: any) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(userActions.setUserData(info));

    const { userData } = getState().user;

    localStorage.setItem('userData', JSON.stringify(userData));
  };
};
