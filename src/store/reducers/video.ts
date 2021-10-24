import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoTree {
  root: {};
}

interface videoSliceState {
  videoTree: VideoTree | null;
  activeVideoId: string;
  videoVolume: number;
}

const initialState: videoSliceState = {
  videoTree: null,
  activeVideoId: '',
  videoVolume: 1,
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
