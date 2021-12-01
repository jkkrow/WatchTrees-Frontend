import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoTree {
  _id?: string;
  root: VideoNode;
  info: TreeInfo;
  data: TreeData;
}

export interface TreeInfo {
  creator?: string;
  title: string;
  tags: string[];
  description: string;
  thumbnail: { name: string; url: string };
  size: number;
  maxDuration: number;
  minDuration: number;
  status: 'public' | 'private';
  isEditing: boolean;
}

export interface TreeData {
  views: number;
  favorites: number;
}

export interface VideoNode {
  id: string;
  prevId?: string;
  layer: number;
  info: NodeInfo | null;
  children: VideoNode[];
}

export interface NodeInfo {
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

export interface VideoTreeWithCreatorInfo extends VideoTree {
  info: TreeInfoWithCreator;
}

export interface TreeInfoWithCreator extends TreeInfo {
  creatorInfo: {
    _id: string;
    name: string;
    picture: string;
  };
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
