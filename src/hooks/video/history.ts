import { useCallback, useMemo } from 'react';

import { useInterval } from 'hooks/common/timer';
import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { VideoNode } from 'store/slices/video-slice';
import { addToHistory } from 'store/thunks/video-thunk';
import { findParents } from 'util/tree';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: VideoNode;
  editMode: boolean;
}

export const useHistory = ({
  videoRef,
  currentVideo,
  editMode,
}: Dependencies) => {
  const videoTree = useAppSelector((state) => state.video.videoTree!);
  const dispatch = useAppDispatch();

  const treeId = useMemo(() => videoTree._id, [videoTree]);
  const previousVideos = useMemo(
    () => findParents(videoTree!, currentVideo._id),
    [videoTree, currentVideo._id]
  );
  const totalProgress = useMemo(
    () =>
      previousVideos.reduce((acc, cur) => acc + (cur.info?.duration || 0), 0),
    [previousVideos]
  );

  const [setHistoryInterval, clearHistoryInterval] = useInterval();

  const updateHistory = useCallback(() => {
    const video = videoRef.current!;
    const endPoint =
      video.duration * 0.95 > video.duration - 10
        ? video.duration - 10
        : video.duration * 0.95;
    const isLastVideo = currentVideo.children.length === 0;
    const endTime = video.duration - endPoint > 180 ? 180 : endPoint;
    const isEnded = isLastVideo && video.currentTime > endTime ? true : false;

    const history = {
      tree: treeId,
      activeNodeId: currentVideo._id,
      progress: video.currentTime,
      totalProgress: video.currentTime + totalProgress,
      isEnded: isEnded,
      updatedAt: new Date(),
    };

    dispatch(addToHistory(history));
  }, [
    videoRef,
    currentVideo._id,
    currentVideo.children,
    treeId,
    totalProgress,
    dispatch,
  ]);

  const startHistoryUpdate = useCallback(
    (interval: number = 5000) => {
      if (editMode) return;
      setHistoryInterval(updateHistory, interval, true);
    },
    [editMode, updateHistory, setHistoryInterval]
  );

  const stopHistoryUpdate = useCallback(() => {
    if (editMode) return;
    clearHistoryInterval();
    updateHistory();
  }, [editMode, clearHistoryInterval, updateHistory]);

  return { startHistoryUpdate, stopHistoryUpdate };
};
