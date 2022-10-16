import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import {
  SourceTree,
  RenderTree,
  SourceNode,
  RenderNode,
} from 'store/types/upload';
import { authActions } from './auth-slice';
import {
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

interface UploadSliceState {
  sourceTree: SourceTree | null;
  renderTree: RenderTree | null;
  activeNodeId: string;
  isUploadSaved: boolean;
}

const initialState: UploadSliceState = {
  sourceTree: null,
  renderTree: null,
  activeNodeId: '',
  isUploadSaved: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    initiateUpload: (
      state,
      {
        payload,
      }: PayloadAction<{ sourceTree: SourceTree; renderTree: RenderTree }>
    ) => {
      state.sourceTree = payload.sourceTree;
      state.renderTree = payload.renderTree;
      state.activeNodeId = payload.sourceTree.root._id;
      state.isUploadSaved = true;
    },

    addNode: (state, { payload }: PayloadAction<{ parentId: string }>) => {
      const sourceTree = state.sourceTree as SourceTree;
      const renderTree = state.renderTree as RenderTree;
      const sourceNode = findById(sourceTree, payload.parentId);
      const renderNode = findById(renderTree, payload.parentId);

      if (!sourceNode || !renderNode) return;

      const newNode = {
        _id: uuidv4(),
        parentId: sourceNode._id,
        level: sourceNode.level + 1,
        name: '',
        label: '',
        url: '',
        size: 0,
        duration: 0,
        selectionTimeStart: 0,
        selectionTimeEnd: 0,
        children: [],
      };

      sourceNode.children.push(newNode);
      renderNode.children.push({ ...newNode, error: null, progress: 0 });
    },

    updateNode: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        info: Partial<SourceNode | RenderNode>;
        exclude?: 'source' | 'render';
      }>
    ) => {
      const sourceTree = state.sourceTree as SourceTree;
      const renderTree = state.renderTree as RenderTree;
      const sourceNode = findById(sourceTree, payload.id);
      const renderNode = findById(renderTree, payload.id);

      if (!sourceNode || !renderNode) return;

      for (let key in payload.info) {
        if (payload.exclude !== 'source' && sourceNode.hasOwnProperty(key)) {
          (sourceNode as any)[key] = (payload.info as any)[key];
        }

        if (payload.exclude !== 'render') {
          (renderNode as any)[key] = (payload.info as any)[key];
        }
      }
    },

    removeNode: (state, { payload }: PayloadAction<{ id: string }>) => {
      const sourceTree = state.sourceTree as SourceTree;
      const renderTree = state.renderTree as RenderTree;
      const sourceNode = findByChildId(sourceTree, payload.id);
      const renderNode = findByChildId(renderTree, payload.id);

      if (!sourceNode || !renderNode) return;

      sourceNode.children = sourceNode.children.filter(
        (child) => child._id !== payload.id
      );

      renderNode.children = renderNode.children.filter(
        (child) => child._id !== payload.id
      );
    },

    updateTree: (
      state,
      { payload }: PayloadAction<{ info: Partial<SourceTree> }>
    ) => {
      const sourceTree = state.sourceTree as SourceTree;
      const renderTree = state.renderTree as RenderTree;

      for (let key in payload.info) {
        (sourceTree as any)[key] = (payload.info as any)[key];
        (renderTree as any)[key] = (payload.info as any)[key];
      }
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },

    saveUpload: (state) => {
      state.isUploadSaved = true;
    },

    finishUpload: (state) => {
      state.sourceTree = null;
      state.renderTree = null;
      state.activeNodeId = '';
      state.isUploadSaved = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authActions.signout, (state) => {
        state.sourceTree = null;
        state.renderTree = null;
        state.activeNodeId = '';
        state.isUploadSaved = false;
      })
      .addMatcher(
        ({ type }) => {
          const prefix = type.split('upload/')[1];
          return prefix ? prefix.match('(update|remove).*') : false;
        },
        (state) => {
          const sourceTree = state.sourceTree as SourceTree;
          const renderTree = state.renderTree as RenderTree;

          const fullSize = getFullSize(sourceTree);
          const { max, min } = getMinMaxDuration(sourceTree);

          sourceTree.size = fullSize;
          sourceTree.maxDuration = max;
          sourceTree.minDuration = min;

          renderTree.size = fullSize;
          renderTree.maxDuration = max;
          renderTree.minDuration = min;

          state.isUploadSaved = false;
        }
      );
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;
