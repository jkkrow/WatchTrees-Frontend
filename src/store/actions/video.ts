import { videoActions, VideoTree } from 'store/reducers/video';

import { AppDispatch } from 'store';

export const setVideoTree = (tree: VideoTree) => {
  return (dispatch: AppDispatch) => {
    dispatch(videoActions.setVideoTree(tree));
  };
};

export const updateActiveVideo = (id: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(videoActions.setActiveVideo(id));
  };
};

export const updateVideoVolume = (volume: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(videoActions.setVideoVolume(volume));
  };
};
