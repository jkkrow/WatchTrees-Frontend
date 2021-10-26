import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v1 as uuidv1 } from 'uuid';

import {
  Node,
  Tree,
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

enum UploadStatus {
  Progressing = 'Progressing',
  Completed = 'Completed',
}

export interface UploadNode extends Node {}

export interface UploadTree extends Tree {
  root: UploadNode;
  title: string;
  tags: string[];
  description: string;
  size: number;
  maxDuration: number;
  minDuration: number;
  status: UploadStatus;
}

interface UploadSliceState {
  uploadTree: UploadTree | null;
  activeNodeId: string;
}

const initialState: UploadSliceState = {
  uploadTree: null,
  activeNodeId: '',
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    initiateUpload: (state) => {
      const node = {
        id: uuidv1(),
        layer: 0,
        info: null,
        children: [],
      };

      state.uploadTree = {
        root: node,
        title: '',
        tags: [],
        description: '',
        size: 0,
        maxDuration: 0,
        minDuration: 0,
        status: UploadStatus.Progressing,
      };

      state.activeNodeId = node.id;
    },

    appendChild: (state, { payload }: PayloadAction<string>) => {
      if (!state.uploadTree) return;

      const uploadNode = findById(state.uploadTree, payload);

      if (!uploadNode) return;

      const node = {
        id: uuidv1(),
        prevId: uploadNode.id,
        layer: uploadNode.layer + 1,
        info: null,
        children: [],
      };

      uploadNode.children.push(node);

      const fullSize = getFullSize(state.uploadTree);
      const { max, min } = getMinMaxDuration(state.uploadTree);

      state.uploadTree.size = fullSize;
      state.uploadTree.maxDuration = max;
      state.uploadTree.minDuration = min;
    },

    setUploadTree: (state, { payload }: PayloadAction<any>) => {
      state.uploadTree = { ...state.uploadTree, ...payload };
    },

    setUploadNode: (
      state,
      { payload }: PayloadAction<{ info: any; nodeId: string }>
    ) => {
      if (!state.uploadTree) return;

      const uploadNode = findById(state.uploadTree, payload.nodeId);

      if (!uploadNode) return;

      if (!uploadNode.info) {
        uploadNode.info = payload.info;
      } else {
        if (payload.info === null) {
          uploadNode.info = null;
        } else {
          uploadNode.info = {
            ...uploadNode.info,
            ...payload.info,
          };
        }
      }

      const fullSize = getFullSize(state.uploadTree);
      const { max, min } = getMinMaxDuration(state.uploadTree);

      state.uploadTree.size = fullSize;
      state.uploadTree.maxDuration = max;
      state.uploadTree.minDuration = min;
    },

    removeNode: (state, { payload }: PayloadAction<string>) => {
      if (!state.uploadTree) return;

      const uploadNode = findByChildId(state.uploadTree, payload);

      if (!uploadNode) return;

      uploadNode.children = uploadNode.children.filter(
        (item) => item.id !== payload
      );

      const fullSize = getFullSize(state.uploadTree);
      const { max, min } = getMinMaxDuration(state.uploadTree);

      state.uploadTree.size = fullSize;
      state.uploadTree.maxDuration = max;
      state.uploadTree.minDuration = min;
    },

    removeTree: (state) => {
      state.uploadTree = null;
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
