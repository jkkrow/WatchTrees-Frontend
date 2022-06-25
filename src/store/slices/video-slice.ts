import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NodeInfo {
  name: string;
  label: string;
  size: number;
  duration: number;
  selectionTimeStart: number;
  selectionTimeEnd: number;
  error: string | null;
  progress: number;
  isConverted: boolean;
  url: string;
}

export interface VideoNode {
  _id: string;
  parentId: string | null;
  layer: number;
  info: NodeInfo | null;
  creator?: string;
  children: VideoNode[];
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

export interface TreeInfoWithCreator extends TreeInfo {
  creatorInfo: {
    name: string;
    picture: string;
  };
}

export interface TreeData {
  views: number;
  favorites: number;
}

export interface VideoTree {
  _id: string;
  root: VideoNode;
  info: TreeInfo;
  createdAt: string;
}

export interface PlayerNode {
  _id: string;
  parentId: string | null;
  layer: number;
  info: NodeInfo;
  children: VideoNode[];
}

export interface PlayerTree {
  _id: string;
  root: PlayerNode;
  info: TreeInfo;
  createdAt: string;
}

export interface History {
  tree: string;
  activeNodeId: string;
  progress: number;
  totalProgress: number;
  isEnded: boolean;
  updatedAt: Date;
}

export interface VideoTreeClient extends VideoTree {
  info: TreeInfoWithCreator;
  history: History | null;
  data: {
    views: number;
    favorites: number;
    isFavorite: boolean;
  };
}

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
