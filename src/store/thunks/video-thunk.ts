import { AppThunk } from 'store';

import { VideoTree, VideoTreeClient, History } from 'store/slices/video-slice';
import {
  getLocalHistory,
  addToLocalHistory,
  removeFromLocalHistory,
  attachLocalHistory,
} from 'util/video';

export const fetchVideo = (id: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;
    const userId = userData ? userData._id : '';
    const client = dispatch(api());

    const response = await client.get(`/videos/client/${id}`, {
      params: { userId },
    });

    const { video } = response.data;

    return userId ? video : attachLocalHistory(video);
  };
};

export const fetchVideos = (params: {
  page: number;
  max: number;
  search?: string;
  channelId?: string;
}): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;
    const userId = userData ? userData._id : '';
    const client = dispatch(api());

    const response = await client.get('/videos/client', {
      params: { ...params, userId },
    });

    const { videos, count } = response.data;

    return { videos: userId ? videos : attachLocalHistory(videos), count };
  };
};

export const fetchCreated = (params: {
  page: number;
  max: number;
}): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const response = await client.get('/videos/created', { params });

    const { videos, count } = response.data;

    return { videos, count };
  };
};

export const fetchHistory = (params: {
  page: number;
  max: number;
  skipFullyWatched: boolean;
}): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;
    const client = dispatch(api());

    if (userData) {
      const { data } = await client.get('/histories', { params });

      return data;
    }

    const result = getLocalHistory(params);

    if (!result || !result.localHistory.length) {
      return { videos: [], count: 0 };
    }

    const { localHistory, count } = result;
    const { data } = await client.get('/videos/client', {
      params: { ids: localHistory },
    });

    return { videos: attachLocalHistory(data.videos, true), count };
  };
};

export const fetchFavorites = (params: {
  page: number;
  max: number;
}): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

    const response = await client.get('/videos/favorites', { params });

    const { videos, count } = response.data;

    return { videos, count };
  };
};

export const addToHistory = (history: History): AppThunk => {
  return async (dispatch, getState, api) => {
    const userData = getState().user.userData;

    if (!userData) {
      addToLocalHistory(history);
      return;
    }

    const client = dispatch(api());
    await client.put('/histories', { history });
  };
};

export const removeFromHistory = (video: VideoTreeClient): AppThunk => {
  return async (dispatch, getState, api) => {
    if (!video.history) return;

    const videoId = video.history.tree;
    const userData = getState().user.userData;

    if (!userData) {
      removeFromLocalHistory(videoId);
      return;
    }

    const client = dispatch(api());
    await client.delete(`/histories/${videoId}`);
  };
};

export const deleteVideo = (video: VideoTree): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());
    const { data } = await client.delete(`/videos/${video._id}`);

    return data;
  };
};

export const toggleFavorites = (videoId: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());
    await client.patch(`/videos/${videoId}/favorites`);
  };
};
