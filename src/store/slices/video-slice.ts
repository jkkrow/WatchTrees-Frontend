import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { VideoTree } from '../types/video';

interface VideoSliceState {
  videoTree: VideoTree | null;
  activeNodeId: string;
  initialProgress: number;
  currentProgress: number;
  videoVolume: number;
  videoResolution: number | 'auto';
  videoPlaybackRate: number;
}

const videoVolumeStorage = localStorage.getItem('video-volume');

const initialState: VideoSliceState = {
  videoTree: null,
  activeNodeId: '',
  initialProgress: 0,
  currentProgress: 0,
  videoVolume: videoVolumeStorage ? +videoVolumeStorage : 1,
  videoResolution: 'auto',
  videoPlaybackRate: 1,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoTree: (state, { payload }: PayloadAction<VideoTree | null>) => {
      state.videoTree = payload;
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },

    setInitialProgress: (state, { payload }: PayloadAction<number>) => {
      state.initialProgress = payload;
    },

    setCurrentProgress: (state, { payload }: PayloadAction<number>) => {
      state.currentProgress = payload;
    },

    setVideoVolume: (state, { payload }: PayloadAction<number>) => {
      state.videoVolume = payload;
    },

    setVideoResolution: (
      state,
      { payload }: PayloadAction<number | 'auto'>
    ) => {
      state.videoResolution = payload;
    },

    setVideoPlaybackRate: (state, { payload }: PayloadAction<number>) => {
      state.videoPlaybackRate = payload;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
