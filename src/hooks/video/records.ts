import { useCallback, useMemo, useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { findParents } from 'util/tree';
import { videoActions, VideoNode } from 'store/slices/video-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: VideoNode;
}

export const useRecords = ({ videoRef, currentVideo }: Dependencies) => {
  const videoTree = useAppSelector((state) => state.video.videoTree!);
  const dispatch = useAppDispatch();

  const [displayRecords, setDisplayRecords] = useState(false);

  const records = useMemo(() => {
    const parents = findParents(videoTree, currentVideo._id);
    parents.push(currentVideo);

    return parents.sort((videoA, videoB) =>
      videoA.layer < videoB.layer ? 1 : -1
    );
  }, [videoTree, currentVideo]);

  const toggleRecords = useCallback(() => {
    setDisplayRecords((prev) => !prev);
  }, []);

  const navigateToSelectedVideo = useCallback(
    (id: string) => {
      dispatch(videoActions.setActiveNode(id));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!displayRecords) return;

    videoRef.current!.pause();
  }, [videoRef, displayRecords]);

  return {
    records,
    displayRecords,
    setDisplayRecords,
    toggleRecords,
    navigateToSelectedVideo,
  };
};
