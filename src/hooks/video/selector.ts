import { useCallback, useMemo, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { PlayerNode, videoActions } from 'store/slices/video-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: PlayerNode;
}

export const useSelector = ({ videoRef, currentVideo }: Dependencies) => {
  const videoTree = useAppSelector((state) => state.video.videoTree!);
  const dispatch = useAppDispatch();

  const [displaySelector, setDisplaySelector] = useState(false);
  const [selectedNextVideoId, setSelectedNextVideoId] = useState<string>('');

  const isSelectorAvailable = useRef(false);

  const rootId = useMemo(() => videoTree.root._id, [videoTree]);
  const { selectionStartPoint, selectionEndPoint } = useMemo(() => {
    const { selectionTimeStart, selectionTimeEnd, duration } =
      currentVideo.info;

    return {
      selectionStartPoint:
        selectionTimeStart >= duration ? duration - 10 : selectionTimeStart,
      selectionEndPoint:
        selectionTimeEnd > duration ? duration : selectionTimeEnd,
    };
  }, [currentVideo.info]);

  const updateSelector = useCallback(() => {
    const video = videoRef.current!;
    const currentTime = video.currentTime || 0;

    if (
      !video.paused &&
      currentTime >= selectionStartPoint &&
      currentTime < selectionEndPoint &&
      currentVideo.children.length > 0 &&
      !selectedNextVideoId
    ) {
      setDisplaySelector(true);
      isSelectorAvailable.current = true;
    } else {
      setDisplaySelector(false);
      isSelectorAvailable.current = false;
    }
  }, [
    videoRef,
    currentVideo.children,
    selectionStartPoint,
    selectionEndPoint,
    selectedNextVideoId,
  ]);

  const selectNextVideo = useCallback(
    (index: number) => {
      if (!isSelectorAvailable.current) return;

      const validVideos = currentVideo.children.filter((video) => video.info);
      const selectedVideo = validVideos[index];

      if (!selectedVideo) return;

      setSelectedNextVideoId(selectedVideo._id);
      setDisplaySelector(false);
    },
    [currentVideo.children]
  );

  const videoEndedHandler = useCallback(() => {
    const firstValidChild = currentVideo.children.find((item) => item.info);
    const isLastVideo = currentVideo.children.length === 0 || !firstValidChild;

    if (isLastVideo) {
      return;
    }

    if (selectedNextVideoId) {
      dispatch(videoActions.setActiveNode(selectedNextVideoId));
      return;
    }

    if (firstValidChild) {
      dispatch(videoActions.setActiveNode(firstValidChild._id));
      return;
    }
  }, [dispatch, currentVideo.children, selectedNextVideoId]);

  const navigateToNextVideo = useCallback(() => {
    const video = videoRef.current!;
    const firstValidChild = currentVideo.children.find((item) => item.info);
    const isLastVideo = currentVideo.children.length === 0 || !firstValidChild;

    if (video.currentTime < selectionStartPoint) {
      video.currentTime = selectionStartPoint;
      return;
    }

    if (isLastVideo) {
      video.currentTime = video.duration;
      return;
    }

    videoEndedHandler();
  }, [videoRef, currentVideo.children, selectionStartPoint, videoEndedHandler]);

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
    displaySelector,
    selectionStartPoint,
    selectionEndPoint,
    updateSelector,
    selectNextVideo,
    videoEndedHandler,
    navigateToNextVideo,
    navigateToPreviousVideo,
    navigateToFirstVideo,
  };
};
