import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoTree {
  _id?: string;
  creator?: string;
  root: VideoNode;
  title: string;
  tags: string[];
  description: string;
  thumbnail: { name: string; url: string };
  size: number;
  maxDuration: number;
  minDuration: number;
  views: number;
  isEditing: boolean;
  status: VideoStatus;
}

export interface VideoNode {
  id: string;
  prevId?: string;
  layer: number;
  info: VideoInfo | null;
  children: VideoNode[];
}

export interface VideoInfo {
  name: string;
  label: string;
  size: number;
  duration: number;
  selectionTimeStart: number | null;
  selectionTimeEnd: number | null;
  error: string | null;
  progress: number;
  isConverted: boolean;
  url: string;
}

export enum VideoStatus {
  Public = 'public',
  Private = 'private',
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
