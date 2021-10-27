import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v1 as uuidv1 } from 'uuid';

import { VideoTree } from './video';
import {
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

interface UploadSliceState {
  uploadTree: VideoTree | null;
  savedTree: VideoTree | null;
  activeNodeId: string;
}

const initialState: UploadSliceState = {
  uploadTree: null,
  savedTree: null,
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
        status: 'Progressing',
      };

      state.savedTree = state.uploadTree;
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

      state.savedTree = state.uploadTree;
    },

    setUploadTree: (state, { payload }: PayloadAction<any>) => {
      state.uploadTree = { ...state.uploadTree, ...payload };
      state.savedTree = state.uploadTree;
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
          uploadNode.info = { ...uploadNode.info, ...payload.info };
        }
      }

      const fullSize = getFullSize(state.uploadTree);
      const { max, min } = getMinMaxDuration(state.uploadTree);

      state.uploadTree.size = fullSize;
      state.uploadTree.maxDuration = max;
      state.uploadTree.minDuration = min;

      state.savedTree = state.uploadTree;
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

      state.savedTree = state.uploadTree;
    },

    removeTree: (state) => {
      state.uploadTree = null;
      state.savedTree = null;
    },

    saveTree: (
      state,
      { payload }: PayloadAction<{ info: any; nodeId: string }>
    ) => {
      if (!state.savedTree) return;

      const savedNode = findById(state.savedTree, payload.nodeId);

      if (!savedNode) return;

      savedNode.info = { ...savedNode.info, ...payload.info };
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
