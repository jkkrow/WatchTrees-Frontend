import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { VideoTree } from 'types/video';

interface VideoSliceState {
  videoTree: VideoTree | null;
  activeVideoId: string;
  videoVolume: number;
}

const videoVolumeStorage = localStorage.getItem('video-volume');

const initialState: VideoSliceState = {
  videoTree: null,
  activeVideoId: '',
  videoVolume: videoVolumeStorage ? +videoVolumeStorage : 1,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoTree: (state, { payload }: PayloadAction<VideoTree>) => {
      state.videoTree = payload;
    },

    setActiveVideo: (state, { payload }: PayloadAction<string>) => {
      state.activeVideoId = payload;
    },

    setVideoVolume: (state, { payload }: PayloadAction<number>) => {
      state.videoVolume = payload;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
