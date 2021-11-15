import { AppThunk } from 'store';
import { userActions, UserData } from 'store/slices/user-slice';

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

export const deleteVideo = (videoId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().user;

    if (!userData) return;

    const client = dispatch(api());

    try {
      const { data } = await client.delete(`/user/video/${videoId}`);

      const newVideos = {
        data: userData.videos.data.filter(
          (video) => video._id !== data.videoId
        ),
        count: userData.videos.count - 1,
      };

      dispatch(updateUserData({ videos: newVideos }));
    } catch (err) {
      dispatch(
        userActions.userFail(`${(err as Error).message}: Failed to load videos`)
      );
    }
  };
};

export const updateUserData = (info: {
  [key in keyof UserData]?: UserData[key];
}): AppThunk => {
  return (dispatch, getState) => {
    dispatch(userActions.setUserData(info));

    const { userData } = getState().user;

    localStorage.setItem('userData', JSON.stringify(userData));
  };
};
