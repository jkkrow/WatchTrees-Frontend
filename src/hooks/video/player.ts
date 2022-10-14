import { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';

import {
  VideoPlayerDependencies,
  VideoPlayerProps,
} from 'components/Video/Player/VideoPlayer';
import { useFirstRender } from 'hooks/common/cycle';
import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { videoActions } from 'store/slices/video-slice';

export const usePlayer = ({
  _id,
  url,
  ...rest
}: VideoPlayerProps): VideoPlayerDependencies => {
  const activeNodeId = useAppSelector((state) => state.video.activeNodeId);
  const initialProgress = useAppSelector(
    (state) => state.video.initialProgress
  );
  const dispatch = useAppDispatch();
  const firstRender = useFirstRender();

  const [player, setPlayer] = useState<shaka.Player | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isUnmounted = useRef(false);

  useEffect(() => {
    if (!firstRender) return;

    const video = videoRef.current!;
    let src = url;

    // Edit mode
    if (src.substring(0, 4) === 'blob') {
      return video.setAttribute('src', src);
    }

    src =
      url.split('.')[1] === 'mpd'
        ? `${process.env.REACT_APP_MEDIA_URL}/${src}`
        : `${process.env.REACT_APP_SOURCE_URL}/${src}`;

    // Connect video to Shaka Player
    const shakaPlayer = new shaka.Player(video);

    (async () => {
      if (activeNodeId === _id && initialProgress) {
        await shakaPlayer.load(src, initialProgress);
        dispatch(videoActions.setInitialProgress(0));
      } else {
        await shakaPlayer.load(src);
      }
    })();

    if (isUnmounted.current) return;

    setPlayer(shakaPlayer);
  }, [dispatch, _id, url, activeNodeId, initialProgress, firstRender]);

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  return { videoRef, player, _id, url, ...rest };
};
