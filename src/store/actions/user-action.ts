import { AppDispatch, AppState, AppThunk } from 'store';
import { userActions, UserData } from 'store/reducers/user-reducer';

export const fetchUserVideos = (
  pageNumber: number,
  forceUpdate: boolean = true
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.get(`/user/videos?page=${pageNumber}`, {
        forceUpdate,
        cache: true,
      });

      dispatch(
        userActions.setUserData({
          videos: { data: data.videos, count: data.count },
        })
      );

      return true;
    } catch (err) {
      dispatch(
        userActions.userFail(`${(err as Error).message}: Failed to load videos`)
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
