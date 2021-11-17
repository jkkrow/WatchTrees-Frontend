import { AppThunk } from 'store';

import { uploadActions } from 'store/slices/upload-slice';
import { uiActions } from 'store/slices/ui-slice';
import { finishUpload } from './upload-thunk';

export const saveVideo = (message?: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree } = getState().upload;

    if (!uploadTree) return;

    const client = dispatch(api());

    try {
      const saveRepsonse = await client.put(`/videos/${uploadTree._id}`, {
        uploadTree,
      });

      dispatch(uploadActions.saveUpload());

      dispatch(
        uiActions.setMessage({
          content: message || saveRepsonse.data.message,
          type: 'message',
          timer: 3000,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Saving upload failed`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const deleteVideo = (videoId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { auth, upload } = getState();
    const { userData } = auth;
    const { uploadTree } = upload;

    if (!userData) return;

    const client = dispatch(api());

    try {
      const { data } = await client.delete(`/videos/${videoId}`);

      if (uploadTree) {
        uploadTree.root.id === data.treeId && dispatch(finishUpload());
      }

      dispatch(
        uiActions.setMessage({
          content: data.message,
          type: 'message',
          timer: 5000,
        })
      );

      return true;
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Deleting video failed`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};
