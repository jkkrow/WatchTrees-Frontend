import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { VideoTree, NodeInfo } from 'store/slices/video-slice';
import {
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

type TreeType = 'uploadTree' | 'previewTree';

interface UploadTree extends Omit<VideoTree, 'data'> {}

interface UploadSliceState {
  uploadTree: UploadTree | null;
  previewTree: UploadTree | null;
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
    initiateUpload: (state, { payload }: PayloadAction<UploadTree>) => {
      state.uploadTree = payload;
      state.previewTree = payload;
      state.activeNodeId = payload.root._id;
      state.isUploadSaved = true;
    },

    appendNode: (
      state,
      { payload }: PayloadAction<{ type?: TreeType; nodeId: string }>
    ) => {
      let trees = [
        state.uploadTree as UploadTree,
        state.previewTree as UploadTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as UploadTree];
      }

      const newNodeId = uuidv4();

      for (let tree of trees) {
        const node = findById(tree, payload.nodeId);

        if (!node) return;

        const newNode = {
          _id: newNodeId,
          _prevId: node._id,
          layer: node.layer + 1,
          info: null,
          children: [],
        };

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
        state.uploadTree as UploadTree,
        state.previewTree as UploadTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as UploadTree];
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
        state.uploadTree as UploadTree,
        state.previewTree as UploadTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as UploadTree];
      }

      for (let tree of trees) {
        if (!tree) return;

        const node = findByChildId(tree, payload.nodeId);

        if (!node) return;

        node.children = node.children.filter(
          (item) => item._id !== payload.nodeId
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
        info: Partial<UploadTree['info']>;
      }>
    ) => {
      switch (payload.type) {
        case 'uploadTree':
          state.uploadTree = {
            ...state.uploadTree,
            info: { ...state.uploadTree?.info, ...payload.info },
          } as UploadTree;
          break;
        case 'previewTree':
          state.previewTree = {
            ...state.previewTree,
            info: { ...state.previewTree?.info, ...payload.info },
          } as UploadTree;
          break;
        default:
          state.uploadTree = {
            ...state.uploadTree,
            info: { ...state.uploadTree?.info, ...payload.info },
          } as UploadTree;
          state.previewTree = {
            ...state.previewTree,
            info: { ...state.previewTree?.info, ...payload.info },
          } as UploadTree;
      }

      state.isUploadSaved = false;
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },

    saveUpload: (state) => {
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
