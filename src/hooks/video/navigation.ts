import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { videoActions } from 'store/slices/video-slice';
import { VideoNode } from 'store/types/video';
import { VideoPlayerDependencies } from 'components/Video/Player/VideoPlayer';

export const useNavigation = ({
  videoRef,
  parentId,
  selectionTimeStart,
  children,
}: VideoPlayerDependencies) => {
  const videoTree = useAppSelector((state) => state.video.videoTree!);
  const dispatch = useAppDispatch();

  const rootId = useMemo(() => videoTree.root._id, [videoTree]);

  const navigateToNextVideo = useCallback(
    (nextVideos: VideoNode[]) => {
      return () => {
        const video = videoRef.current!;
        const validNextVideos = children.filter((video) => video.url);
        const isLastVideo = !validNextVideos.length;

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
    [videoRef, selectionTimeStart, children, dispatch]
  );

  const navigateToPreviousVideo = useCallback(() => {
    if (!parentId) {
      videoRef.current!.currentTime = 0;
      return;
    }

    dispatch(videoActions.setActiveNode(parentId));
  }, [videoRef, dispatch, parentId]);

  const navigateToFirstVideo = useCallback(() => {
    if (!parentId) {
      videoRef.current!.currentTime = 0;
      return;
    }

    dispatch(videoActions.setActiveNode(rootId));
  }, [videoRef, dispatch, rootId, parentId]);

  return {
    navigateToNextVideo,
    navigateToPreviousVideo,
    navigateToFirstVideo,
  };
};
