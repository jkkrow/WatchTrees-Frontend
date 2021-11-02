import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Node, Tree } from 'util/tree';

export interface VideoNode extends Node {}

export enum VideoStatus {
  Public = 'public',
  Private = 'private',
}

export interface VideoTree extends Tree {
  _id?: string;
  root: VideoNode;
  title: string;
  tags: string[];
  description: string;
  thumbnail?: string;
  size: number;
  maxDuration: number;
  minDuration: number;
  views: number;
  isEditing: boolean;
  status: VideoStatus;
}

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
