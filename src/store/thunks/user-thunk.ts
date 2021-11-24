import { AppThunk } from 'store';
import { userActions } from 'store/slices/user-slice';

export const fetchUserVideos = (
  pageNumber: number,
  itemsPerPage: number,
  forceUpdate: boolean = true
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      dispatch(userActions.userRequest());

      const { data } = await client.get(
        `/videos/user?page=${pageNumber}&max=${itemsPerPage}`,
        {
          forceUpdate,
          cache: true,
        }
      );

      dispatch(userActions.userSuccess());

      return data;
    } catch (err) {
      dispatch(
        userActions.userFail(`${(err as Error).message}: Failed to load videos`)
      );
    }
  };
};
