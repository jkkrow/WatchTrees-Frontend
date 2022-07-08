import { useCallback, useMemo, useState, useEffect, useRef } from 'react';

import { VideoPlayerDependencies } from 'components/Video/Player/VideoPlayer';
import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { findAncestors } from 'util/tree';
import { videoActions } from 'store/slices/video-slice';

export const useRecords = ({ videoRef, id }: VideoPlayerDependencies) => {
  const videoTree = useAppSelector((state) => state.video.videoTree!);
  const dispatch = useAppDispatch();

  const [displayRecords, setDisplayRecords] = useState(false);

  const wasPlaying = useRef(false);

  const records = useMemo(() => {
    const ancestors = findAncestors(videoTree, id, true);

    return ancestors.sort((videoA, videoB) =>
      videoA.layer < videoB.layer ? 1 : -1
    );
  }, [videoTree, id]);

  const toggleRecords = useCallback(() => {
    setDisplayRecords((prev) => !prev);
  }, []);

  const closeRecords = useCallback(() => {
    setDisplayRecords(false);
  }, []);

  const navigateToSelectedVideo = useCallback(
    (id: string) => {
      setDisplayRecords(false);
      dispatch(videoActions.setActiveNode(id));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!displayRecords) return;

    videoRef.current!.pause();
  }, [videoRef, displayRecords]);

  useEffect(() => {
    const video = videoRef.current!;

    return () => {
      if (!displayRecords && !video.paused) {
        wasPlaying.current = true;
      }

      if (displayRecords && wasPlaying.current) {
        video.play();
        wasPlaying.current = false;
      }
    };
  }, [videoRef, displayRecords]);

  return {
    records,
    displayRecords,
    toggleRecords,
    closeRecords,
    navigateToSelectedVideo,
  };
};
