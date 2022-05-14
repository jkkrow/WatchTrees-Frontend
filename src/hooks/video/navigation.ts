import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { PlayerNode, videoActions } from 'store/slices/video-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: PlayerNode;
}

export const useNavigation = ({ videoRef, currentVideo }: Dependencies) => {
  const videoTree = useAppSelector((state) => state.video.videoTree!);
  const dispatch = useAppDispatch();

  const rootId = useMemo(() => videoTree.root._id, [videoTree]);

  const navigateToNextVideo = useCallback(
    (nextVideos: PlayerNode[]) => {
      return () => {
        const video = videoRef.current!;
        const validNextVideos = currentVideo.children.filter(
          (video) => video.info
        );
        const isLastVideo = !validNextVideos.length;
        const selectionTimeStart = currentVideo.info.selectionTimeStart;

        if (isLastVideo) {
          video.currentTime = video.duration;
          return;
        }

        if (video.currentTime < selectionTimeStart) {
          video.currentTime = selectionTimeStart;
          return;
        }

        dispatch(
          videoActions.setActiveNode((nextVideos || validNextVideos)[0]._id)
        );
      };
    },
    [
      videoRef,
      currentVideo.info.selectionTimeStart,
      currentVideo.children,
      dispatch,
    ]
  );

  const navigateToPreviousVideo = useCallback(() => {
    if (!currentVideo.parentId) {
      videoRef.current!.currentTime = 0;
      return;
    }

    dispatch(videoActions.setActiveNode(currentVideo.parentId));
  }, [videoRef, dispatch, currentVideo.parentId]);

  const navigateToFirstVideo = useCallback(() => {
    if (!currentVideo.parentId) {
      videoRef.current!.currentTime = 0;
      return;
    }

    dispatch(videoActions.setActiveNode(rootId));
  }, [videoRef, dispatch, rootId, currentVideo.parentId]);

  return {
    navigateToNextVideo,
    navigateToPreviousVideo,
    navigateToFirstVideo,
  };
};
