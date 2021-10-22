import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    videoTree: {},
    activeVideoId: '',
    videoVolume: 1,
  },
  reducers: {
    setVideoTree: (state, { payload }) => {
      state.videoTree = payload.videoTree;
    },

    setActiveVideo: (state, { payload }) => {
      state.activeVideoId = payload.activeVideoId;
    },

    setVideoVolume: (state, { payload }) => {
      state.videoVolume = payload.videoVolume;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
