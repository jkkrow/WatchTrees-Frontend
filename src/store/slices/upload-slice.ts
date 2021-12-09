import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { VideoTree, NodeInfo } from 'store/slices/video-slice';
import {
  createNode,
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

type TreeType = 'uploadTree' | 'previewTree';

interface UploadSliceState {
  uploadTree: VideoTree | null;
  previewTree: VideoTree | null;
  activeNodeId: string;
  isUploadSaved: boolean;
}

const initialState: UploadSliceState = {
  uploadTree: null,
  previewTree: null,
  activeNodeId: '',
  isUploadSaved: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    initiateUpload: (
      state,
      { payload }: PayloadAction<VideoTree | undefined>
    ) => {
      const tree: VideoTree = payload || {
        root: createNode(),
        info: {
          title: '',
          tags: [],
          description: '',
          size: 0,
          maxDuration: 0,
          minDuration: 0,
          thumbnail: { name: '', url: '' },
          status: 'public',
          isEditing: true,
        },
        data: {
          views: 0,
          favorites: 0,
        },
        createdAt: new Date().toString(),
      };

      state.uploadTree = tree;
      state.previewTree = tree;
      state.activeNodeId = tree.root.id;
      state.isUploadSaved = true;
    },

    appendNode: (
      state,
      { payload }: PayloadAction<{ type?: TreeType; nodeId: string }>
    ) => {
      let trees = [
        state.uploadTree as VideoTree,
        state.previewTree as VideoTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as VideoTree];
      }

      const newNode = createNode();

      for (let tree of trees) {
        const node = findById(tree, payload.nodeId);

        if (!node) return;

        newNode.prevId = node.id;
        node.children.push(newNode);

        const { max, min } = getMinMaxDuration(tree);

        tree.info.maxDuration = max;
        tree.info.minDuration = min;
      }

      state.isUploadSaved = false;
    },

    setNode: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: TreeType;
        info: Partial<NodeInfo> | null;
        nodeId: string;
      }>
    ) => {
      let trees = [
        state.uploadTree as VideoTree,
        state.previewTree as VideoTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as VideoTree];
      }

      for (let tree of trees) {
        const node = findById(tree, payload.nodeId);

        if (!node) return;

        if (!node.info) {
          node.info = payload.info as NodeInfo;
        } else {
          if (payload.info === null) {
            node.info = null;
          } else {
            node.info = { ...node.info, ...payload.info };
          }
        }

        const fullSize = getFullSize(tree);
        const { max, min } = getMinMaxDuration(tree);

        tree.info.size = fullSize;
        tree.info.maxDuration = max;
        tree.info.minDuration = min;
      }

      state.isUploadSaved = false;
    },

    removeNode: (
      state,
      { payload }: PayloadAction<{ type?: TreeType; nodeId: string }>
    ) => {
      let trees = [
        state.uploadTree as VideoTree,
        state.previewTree as VideoTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as VideoTree];
      }

      for (let tree of trees) {
        if (!tree) return;

        const node = findByChildId(tree, payload.nodeId);

        if (!node) return;

        node.children = node.children.filter(
          (item) => item.id !== payload.nodeId
        );

        const fullSize = getFullSize(tree);
        const { max, min } = getMinMaxDuration(tree);

        tree.info.size = fullSize;
        tree.info.maxDuration = max;
        tree.info.minDuration = min;
      }

      state.isUploadSaved = false;
    },

    setTree: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: TreeType;
        info: Partial<VideoTree['info']>;
      }>
    ) => {
      switch (payload.type) {
        case 'uploadTree':
          state.uploadTree = {
            ...state.uploadTree,
            info: { ...state.uploadTree?.info, ...payload.info },
          } as VideoTree;
          break;
        case 'previewTree':
          state.previewTree = {
            ...state.previewTree,
            info: { ...state.previewTree?.info, ...payload.info },
          } as VideoTree;
          break;
        default:
          state.uploadTree = {
            ...state.uploadTree,
            info: { ...state.uploadTree?.info, ...payload.info },
          } as VideoTree;
          state.previewTree = {
            ...state.previewTree,
            info: { ...state.previewTree?.info, ...payload.info },
          } as VideoTree;
      }

      state.isUploadSaved = false;
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },

    saveUpload: (state, { payload }: PayloadAction<string | undefined>) => {
      if (payload && state.uploadTree) {
        state.uploadTree._id = payload;
      }

      state.isUploadSaved = true;
    },

    finishUpload: (state) => {
      state.uploadTree = null;
      state.previewTree = null;
      state.activeNodeId = '';
      state.isUploadSaved = false;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
