import { useState, useEffect, useCallback } from 'react';

import { VideoPlayerDependencies } from 'components/Video/Player/VideoPlayer';
import { useInterval } from 'hooks/common/timer';
import { videoActions } from 'store/slices/video-slice';
import { useAppSelector, useAppDispatch } from 'hooks/common/store';

export const useResolution = ({ player, active }: VideoPlayerDependencies) => {
  const videoResolution = useAppSelector(
    (state) => state.video.videoResolution
  );
  const dispatch = useAppDispatch();

  const [resolutions, setResolutions] = useState<shaka.extern.TrackList>([]);
  const [activeResolutionHeight, setActiveResolutionHeight] = useState<
    number | 'auto'
  >(videoResolution || 'auto');

  const [setResolutionInterval, clearResolutionInterval] = useInterval();

  const changeResolution = useCallback(
    (resolution: shaka.extern.Track | 'auto') => {
      if (!player) return;

      let resolutionHeight: number | 'auto' = 'auto';

      if (resolution === 'auto') {
        player.configure({ abr: { enabled: true } });
      } else {
        player.configure({ abr: { enabled: false } });
        player.selectVariantTrack(resolution);

        resolutionHeight = resolution.height as number;
      }

      setActiveResolutionHeight(resolutionHeight);
      dispatch(videoActions.setVideoResolution(resolutionHeight));
    },
    [player, dispatch]
  );

  const configureResolution = useCallback(() => {
    if (!player) return;

    if (videoResolution === 'auto') {
      player.configure({ abr: { enabled: true } });
      setActiveResolutionHeight(videoResolution);
      return;
    }

    const tracks = player.getVariantTracks();
    const matchedResolution = tracks.find(
      (track) => track.height === videoResolution
    );

    if (matchedResolution) {
      player.configure({ abr: { enabled: false } });
      player.selectVariantTrack(matchedResolution);
    }
  }, [player, videoResolution]);

  const setTracks = useCallback(() => {
    if (!player) return;
    setResolutions(player.getVariantTracks());
  }, [player]);

  useEffect(setTracks, [setTracks]);

  useEffect(() => {
    if (activeResolutionHeight === 'auto') {
      clearResolutionInterval();
      return;
    }

    setResolutionInterval(setTracks, 5000);
  }, [
    activeResolutionHeight,
    setTracks,
    setResolutionInterval,
    clearResolutionInterval,
  ]);

  useEffect(() => {
    if (active) return;
    configureResolution();
  }, [active, configureResolution]);

  return {
    resolutions,
    activeResolutionHeight,
    changeResolution,
    configureResolution,
  };
};
