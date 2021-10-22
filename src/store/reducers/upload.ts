import { createSlice } from '@reduxjs/toolkit';
import { v1 as uuidv1 } from 'uuid';

import {
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    uploadTree: {},
    previewTree: {},
    activeNodeId: '',
    warning: null,
    error: null,
    saved: null,
  },
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
      state.previewTree = {
        root: node,
      };

      state.activeNodeId = node.id;
    },

    appendChild: (state, { payload }) => {
      const uploadNode = findById(state.uploadTree, payload.nodeId);
      const previewNode = findById(state.previewTree, payload.nodeId);

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

    setUploadTree: (state, { payload }) => {
      state.uploadTree = { ...state.uploadTree, ...payload.info };
    },

    setPreviewTree: (state, { payload }) => {
      state.previewTree = { ...state.previewTree, ...payload.info };
    },

    setUploadNode: (state, { payload }) => {
      const uploadNode = findById(state.uploadTree, payload.nodeId);

      if (!uploadNode.info) {
        uploadNode.info = payload.info;

        const fullSize = getFullSize(state.uploadTree);
        const { max, min } = getMinMaxDuration(state.uploadTree);

        state.uploadTree.size = fullSize;
        state.uploadTree.maxDuration = max;
        state.uploadTree.minDuration = min;
      } else {
        uploadNode.info = {
          ...uploadNode.info,
          ...payload.info,
        };
      }
    },

    setPreviewNode: (state, { payload }) => {
      const previewNode = findById(state.previewTree, payload.nodeId);

      if (!previewNode.info) {
        previewNode.info = payload.info;
      } else {
        previewNode.info = {
          ...previewNode.info,
          ...payload.info,
        };
      }
    },

    removeNode: (state, { payload }) => {
      const uploadNode = findByChildId(state.uploadTree, payload.nodeId);
      const previewNode = findByChildId(state.previewTree, payload.nodeId);

      uploadNode.children = uploadNode.children.filter(
        (item) => item.id !== payload.nodeId
      );
      previewNode.children = previewNode.children.filter(
        (item) => item.id !== payload.nodeId
      );

      const fullSize = getFullSize(state.uploadTree);
      const { max, min } = getMinMaxDuration(state.uploadTree);

      state.uploadTree.size = fullSize;
      state.uploadTree.maxDuration = max;
      state.uploadTree.minDuration = min;
    },

    removeTree: (state) => {
      state.uploadTree = {};
      state.previewTree = {};
    },

    saveTree: (state, { payload }) => {
      state.saved = payload.saved;
    },

    setWarning: (state, { payload }) => {
      state.warning = payload.warning;
    },

    setError: (state, { payload }) => {
      state.error = payload.error;
    },

    setActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
