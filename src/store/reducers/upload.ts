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

export interface PreviewNode extends Node {}

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

export interface PreviewTree extends Tree {
  root: PreviewNode;
}

interface UploadSliceState {
  uploadTree: UploadTree | null;
  previewTree: PreviewTree | null;
  activeNodeId: string;
}

const initialState: UploadSliceState = {
  uploadTree: null,
  previewTree: null,
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
      state.previewTree = {
        root: node,
      };

      state.activeNodeId = node.id;
    },

    appendChild: (state, { payload }: PayloadAction<string>) => {
      if (!state.uploadTree || !state.previewTree) return;

      const uploadNode = findById(state.uploadTree, payload);
      const previewNode = findById(state.previewTree, payload);

      if (!uploadNode || !previewNode) return;

      const node = {
        id: uuidv1(),
        prevId: uploadNode.id,
        layer: uploadNode.layer + 1,
        info: null,
        children: [],
      };

      uploadNode.children.push(node);
      previewNode.children.push(node);

      const fullSize = getFullSize(state.uploadTree);
      const { max, min } = getMinMaxDuration(state.uploadTree);

      state.uploadTree.size = fullSize;
      state.uploadTree.maxDuration = max;
      state.uploadTree.minDuration = min;
    },

    setUploadTree: (state, { payload }: PayloadAction<any>) => {
      state.uploadTree = { ...state.uploadTree, ...payload };
    },

    setPreviewTree: (state, { payload }: PayloadAction<any>) => {
      state.previewTree = { ...state.previewTree, ...payload };
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

    setPreviewNode: (
      state,
      { payload }: PayloadAction<{ info: any; nodeId: string }>
    ) => {
      if (!state.previewTree) return;

      const previewNode = findById(state.previewTree, payload.nodeId);

      if (!previewNode) return;

      if (!previewNode.info) {
        previewNode.info = payload.info;
      } else {
        if (payload.info === null) {
          previewNode.info = null;
        } else {
          previewNode.info = {
            ...previewNode.info,
            ...payload.info,
          };
        }
      }
    },

    removeNode: (state, { payload }: PayloadAction<string>) => {
      if (!state.uploadTree || !state.previewTree) return;

      const uploadNode = findByChildId(state.uploadTree, payload);
      const previewNode = findByChildId(state.previewTree, payload);

      if (!uploadNode || !previewNode) return;

      uploadNode.children = uploadNode.children.filter(
        (item) => item.id !== payload
      );
      previewNode.children = previewNode.children.filter(
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
      state.previewTree = null;
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
