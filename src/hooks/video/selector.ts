import { useCallback, useEffect, useState } from 'react';

import { useTimeout } from 'hooks/common/timer';
import { useAppDispatch } from 'hooks/common/store';
import { PlayerNode, videoActions } from 'store/slices/video-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: PlayerNode;
  active: boolean;
}

export const useSelector = ({
  videoRef,
  currentVideo,
  active,
}: Dependencies) => {
  const dispatch = useAppDispatch();

  const [displaySelector, setDisplaySelector] = useState(false);
  const [displaySelectorTimer, setDisplaySelectorTimer] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [temporarilyVisible, setTemporarilyVisible] = useState(false);
  const [leftTime, setLeftTime] = useState(0);
  const [nextVideos, setNextVideos] = useState(
    currentVideo.children.filter((video) => video.info) as PlayerNode[]
  );

  const [setSelectorTimeout] = useTimeout();

  const updateSelector = useCallback(() => {
    const video = videoRef.current!;
    const currentTime = video.currentTime || 0;
    const selectionTimeStart = currentVideo.info.selectionTimeStart;
    const selectionTimeEnd = currentVideo.info.selectionTimeEnd;

    if (
      currentTime >= selectionTimeStart &&
      currentTime < selectionTimeEnd &&
      nextVideos.length &&
      !video.paused &&
      !isSelected
    ) {
      setDisplaySelector(true);
    } else {
      setDisplaySelector(false);
    }

    if (!isSelected && selectionTimeEnd - currentTime <= 5) {
      setDisplaySelectorTimer(true);
      setLeftTime(Math.floor(selectionTimeEnd) - Math.floor(currentTime));
    } else {
      setDisplaySelectorTimer(false);
    }
  }, [
    videoRef,
    currentVideo.info.selectionTimeStart,
    currentVideo.info.selectionTimeEnd,
    nextVideos.length,
    isSelected,
  ]);

  const selectNextVideo = useCallback(
    (index: number) => {
      if (!displaySelector || !nextVideos[index] || isSelected) return;

      setNextVideos([nextVideos[index]]);
      setDisplaySelector(false);
      setDisplaySelectorTimer(false);
      setIsSelected(true);
      setTemporarilyVisible(true);

      setSelectorTimeout(() => {
        setTemporarilyVisible(false);
      }, 2000);
    },
    [displaySelector, nextVideos, isSelected, setSelectorTimeout]
  );

  const videoEndedHandler = useCallback(() => {
    if (!nextVideos.length) return;

    dispatch(videoActions.setActiveNode(nextVideos[0]._id));
  }, [dispatch, nextVideos]);

  useEffect(() => {
    if (active) return;

    setIsSelected(false);
    setNextVideos(
      currentVideo.children.filter((video) => video.info) as PlayerNode[]
    );
  }, [active, currentVideo.children]);

  return {
    displaySelector: displaySelector || temporarilyVisible,
    displaySelectorTimer,
    leftTime,
    nextVideos,
    updateSelector,
    selectNextVideo,
    videoEndedHandler,
  };
};
