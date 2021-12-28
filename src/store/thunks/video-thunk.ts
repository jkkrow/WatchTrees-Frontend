import { AppThunk } from 'store';

import { VideoTree, VideoListDetail, History } from 'store/slices/video-slice';
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
    const { userData } = getState().user;

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

export const fetchCreated = (
  params: any,
  forceUpdate: boolean = true
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const response = await client.get('/videos/user', {
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
          timer: 5000,
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
        const { data } = await client.get('/videos/history', {
          params,
          forceUpdate,
          cache: true,
        });

        return data;
      } else {
        const result = getLocalHistory(params);

        if (!result || !result.localHistory.length) {
          return { videos: [], count: result?.count || 0 };
        }

        const { localHistory, count } = result;

        const { data } = await client.get('/videos/history-local', {
          params: { localHistory },
          forceUpdate,
          cache: true,
        });

        attachLocalHistory(data.videos);
        sortByHistory(data.videos);
        data.count = count;

        return data;
      }
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to load videos`,
        type: 'error',
        timer: 5000,
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
        timer: 5000,
      });
      throw err;
    }
  };
};

export const addToHistory = (history: History): AppThunk => {
  return async (dispatch, getState, api) => {
    const { refreshToken } = getState().user;

    const client = dispatch(api());

    try {
      if (refreshToken) {
        await client.patch('/videos/history', { history });
      } else {
        addToLocalHistory(history);
      }
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to add to favorites`,
        type: 'error',
        timer: 3000,
      });
      throw err;
    }
  };
};

export const removeFromHistory = (video: VideoListDetail): AppThunk => {
  return async (dispatch, getState, api) => {
    if (!video.history) return;

    const { refreshToken } = getState().user;

    const client = dispatch(api());

    try {
      const historyId = video.history.video;

      if (refreshToken) {
        await client.delete('/videos/history', { params: { historyId } });
      } else {
        removeFromLocalHistory(historyId);
      }

      video.history = null;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to remove from history`,
        type: 'error',
        timer: 5000,
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

export const toggleFavorites = (videoId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    try {
      const { data } = await client.patch('/videos/favorites', { videoId });

      return data;
    } catch (err) {
      uiActions.setMessage({
        content: `${(err as Error).message}: Failed to add to favorites`,
        type: 'error',
        timer: 5000,
      });
      throw err;
    }
  };
};
