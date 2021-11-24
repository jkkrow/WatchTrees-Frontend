import { AppThunk } from 'store';

import { VideoTree } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import { uiActions } from 'store/slices/ui-slice';
import { finishUpload } from './upload-thunk';

export const saveVideo = (message?: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree } = getState().upload;

    if (!uploadTree) return;

    const client = dispatch(api());

    try {
      const { data } = await client.put(`/videos/${uploadTree._id}`, {
        uploadTree,
      });

      if (data.treeId) {
        dispatch(uploadActions.setTree({ info: { _id: data.treeId } }));
      }

      dispatch(uploadActions.saveUpload());

      dispatch(
        uiActions.setMessage({
          content: message || data.message,
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

export const deleteVideo = (video: VideoTree): AppThunk => {
  return async (dispatch, getState, api) => {
    const { auth, upload } = getState();
    const { userData } = auth;
    const { uploadTree } = upload;

    if (!userData) return;

    const client = dispatch(api());

    try {
      const { data } = await client.delete(`/videos/${video._id}`);

      if (uploadTree) {
        uploadTree.root.id === video.root.id && dispatch(finishUpload());
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
