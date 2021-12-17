import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface VideoNode {
  id: string;
  prevId?: string;
  layer: number;
  info: NodeInfo | null;
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
  data: TreeData;
  createdAt: string;
}

export interface History {
  video: string;
  progress: {
    activeVideoId: string;
    time: number;
    isEnded: boolean;
  };
  updatedAt: Date;
}

export interface VideoListDetail extends VideoTree {
  info: TreeInfoWithCreator;
  history: History | null;
}

export interface VideoItemDetail extends VideoListDetail {
  data: {
    views: number;
    favorites: number;
    isFavorite: boolean;
  };
}

interface VideoSliceState {
  videoTree: VideoTree | null;
  activeVideoId: string;
  initialProgress: number;
  videoVolume: number;
}

const videoVolumeStorage = localStorage.getItem('video-volume');

const initialState: VideoSliceState = {
  videoTree: null,
  activeVideoId: '',
  initialProgress: 0,
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

    setInitialProgress: (state, { payload }: PayloadAction<number>) => {
      state.initialProgress = payload;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;
