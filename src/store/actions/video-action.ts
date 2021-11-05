import { AppDispatch } from 'store';
import { videoActions } from 'store/reducers/video-reducer';
import { VideoTree } from 'types/video';

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
