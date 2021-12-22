import { AppThunk } from 'store';

import { VideoTree } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import { uiActions } from 'store/slices/ui-slice';
import { finishUpload } from './upload-thunk';
import { attachLocalHistory } from 'util/video';

export const fetchVideo = (id: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().auth;

    const currentUserId = userData ? userData._id : '';

    const client = dispatch(api());

    try {
      const response = await client.get(`/videos/${id}`, {
        params: { currentUserId },
      });

      const { video } = response.data;

      if (!currentUserId) {
        attachLocalHistory(video);
      }

      return video;
    } catch (err) {
      uiActions.setMessage({
        type: 'error',
        content: `${(err as Error).message}: Fetching video failed`,
        timer: 5000,
      });
      throw err;
    }
  };
};

export const fetchVideos = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().auth;

    const currentUserId = userData ? userData._id : '';

    const client = dispatch(api());

    try {
      const response = await client.get('/videos', {
        params: { ...params, currentUserId },
        forceUpdate,
        cache: true,
      });

      const { videos, count } = response.data;

      if (!currentUserId) {
        attachLocalHistory(videos);
      }

      return { videos, count };
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          type: 'error',
          content: `${(err as Error).message}: Fetching videos failed`,
          timer: 5000,
        })
      );
      throw err;
    }
  };
};

export const saveVideo = (message?: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree } = getState().upload;

    if (!uploadTree) return;

    const client = dispatch(api());

    try {
      const { data } = await client.put('/videos/', { uploadTree });

      dispatch(uploadActions.saveUpload(data.videoId));

      if (message) {
        dispatch(
          uiActions.setMessage({
            type: 'message',
            content: message,
            timer: 3000,
          })
        );
      }
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          type: 'error',
          content: `${(err as Error).message}: Saving upload failed`,
          timer: 5000,
        })
      );
      throw err;
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
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Deleting video failed`,
          type: 'error',
          timer: 5000,
        })
      );
      throw err;
    }
  };
};
