import { AxiosError } from 'axios';

import { AppDispatch, AppState, AppThunk } from 'store';
import { userActions, UserData } from 'store/reducers/user-reducer';

export const fetchUserVideos = (pageNumber: number): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.get(`/user/videos?page=${pageNumber}`);

      dispatch(userActions.userSuccess());

      return { videos: data.videos, totalPage: data.totalPage };
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        userActions.userFail(
          `${
            error.response?.data?.message || error.message
          } - Failed to load videos.`
        )
      );
    }
  };
};

export const updateUserData = (info: {
  [key in keyof UserData]?: UserData[key];
}) => {
  return (dispatch: AppDispatch, getState: () => AppState) => {
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
