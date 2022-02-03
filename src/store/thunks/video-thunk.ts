import { AppThunk } from 'store';

import { VideoTree, VideoTreeClient, History } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import { uiActions } from 'store/slices/ui-slice';
import { finishUpload } from './upload-thunk';
import {
  addToLocalHistory,
  attachLocalHistory,
  getLocalHistory,
  removeFromLocalHistory,
  sortByHistory,
} from 'util/video';

export const fetchVideo = (id: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().user;

    const currentUserId = userData ? userData._id : '';

    const client = dispatch(api());

    try {
      const response = await client.get(`/videos/${id}/client`, {
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
      });
      throw err;
    }
  };
};

export const fetchVideos = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, getState, api) => {
    const { userData } = getState().user;

    const currentUserId = userData ? userData._id : '';

    const client = dispatch(api());

    try {
      const response = await client.get('/videos/client', {
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
        })
      );
      throw err;
    }
  };
};

export const fetchCreated = (
  params: any,
  forceUpdate: boolean = true
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const response = await client.get('/videos', {
        params,
        forceUpdate,
        cache: true,
      });

      const { videos, count } = response.data;

      return { videos, count };
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Failed to load videos`,
          type: 'error',
        })
      );
      throw err;
    }
  };
};

export const fetchHistory = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, getState, api) => {
    const { refreshToken } = getState().user;

    const client = dispatch(api());

    try {
      if (refreshToken) {
        const { data } = await client.get('/histories', {
          params,
          forceUpdate,
          cache: true,
        });

        return data;
      }

      const result = getLocalHistory(params);

      if (!result || !result.localHistory.length) {
        return { videos: [], count: result?.count || 0 };
      }

      const { localHistory, count } = result;

      const { data } = await client.get('/videos/client', {
        params: { ids: localHistory },
        forceUpdate,
        cache: true,
      });

      attachLocalHistory(data.videos);
      sortByHistory(data.videos);
      data.count = count;

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load videos`,
        type: 'error',
      });
      throw err;
    }
  };
};

export const fetchFavorites = (params: any, forceUpdate = true): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const response = await client.get('/videos/favorites', {
        params,
        forceUpdate,
        cache: true,
      });

      const { videos, count } = response.data;

      return { videos, count };
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load videos`,
        type: 'error',
      });
      throw err;
    }
  };
};

export const addToHistory = (history: History): AppThunk => {
  return async (dispatch, getState, api) => {
    const { refreshToken } = getState().user;

    if (!refreshToken) {
      addToLocalHistory(history);
      return;
    }

    const client = dispatch(api());

    try {
      await client.put('/histories', { history });
    } catch (err) {
      throw err;
    }
  };
};

export const removeFromHistory = (video: VideoTreeClient): AppThunk => {
  return async (dispatch, getState, api) => {
    if (!video.history) return;

    const videoId = video.history.video;
    const { refreshToken } = getState().user;

    if (!refreshToken) {
      removeFromLocalHistory(videoId);
      return;
    }

    const client = dispatch(api());

    try {
      await client.delete(`/histories/${videoId}`);
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to remove from history`,
        type: 'error',
      });
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
      await client.patch(`/videos/${uploadTree._id}`, { uploadTree });

      dispatch(uploadActions.saveUpload());

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
        })
      );
      throw err;
    }
  };
};

export const deleteVideo = (video: VideoTree): AppThunk => {
  return async (dispatch, getState, api) => {
    const { user, upload } = getState();

    const { userData } = user;
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
          timer: 3000,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Deleting video failed`,
          type: 'error',
        })
      );
      throw err;
    }
  };
};

export const toggleFavorites = (videoId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.patch(`/videos/${videoId}/favorites`);

      uiActions.setMessage({
        content: data.message,
        type: 'message',
        timer: 3000,
      });
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to add to favorites`,
        type: 'error',
      });
      throw err;
    }
  };
};
