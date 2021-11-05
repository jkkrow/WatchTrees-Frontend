import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import shaka from 'shaka-player';

import Playback from './Controls/Playback';
import Volume from './Controls/Volume';
import Progress from './Controls/Progress';
import Time from './Controls/Time';
import Fullscreen from './Controls/Fullscreen';
import Selector from './Controls/Selector';
import Navigation from './Controls/Navigation';
import Loader from './Controls/Loader';
import { useTimeout } from 'hooks/timer-hook';
import { useCompare, useFirstRender } from 'hooks/cycle-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoNode } from 'types/video';
import {
  updateActiveVideo,
  updateVideoVolume,
} from 'store/actions/video-action';
import { updateNode } from 'store/actions/upload-action';
import { formatTime } from 'util/format';
import './VideoPlayer.scss';

interface VideoPlayerProps {
  currentVideo: VideoNode;
  treeId: string;
  autoPlay: boolean;
  editMode: boolean;
  active: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  treeId,
  autoPlay,
  editMode,
  active,
}) => {
  const { videoVolume } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();

  // vp-container
  const [displayCursor, setDisplayCursor] = useState('default');

  // vp-controls
  const [canPlayType, setCanPlayType] = useState(true);
  const [displayControls, setDisplayControls] = useState(true);

  // playback
  const [playbackState, setPlaybackState] = useState(false);

  // volume
  const [volumeState, setVolumeState] = useState(videoVolume || 1);

  // progress
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [seekProgress, setSeekProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // seek tooltip
  const [seekTooltip, setSeekTooltip] = useState('00:00');
  const [seekTooltipPosition, setSeekTooltipPosition] = useState('');

  // time ui
  const [currentTimeUI, setCurrentTimeUI] = useState('00:00');
  const [remainedTimeUI, setRemainedTimeUI] = useState('00:00');

  // fullscreen button
  const [fullscreen, setFullscreen] = useState(false);

  // vp-loader
  const [displayLoader, setDisplayLoader] = useState(true);

  // vp-selector
  const [displaySelector, setDisplaySelector] = useState(false);
  const [selectedNextVideoId, setSelectedNextVideoId] = useState<string>('');

  // vp-navigation
  const [timelineMarked, setTimelineMarked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoProgressRef = useRef<HTMLDivElement>(null);

  const volumeData = useRef(videoVolume || 1);
  const progressSeekData = useRef(0);
  const selectorData = useRef(false);

  const [controlsTimeout] = useTimeout();
  const [volumeTimeout] = useTimeout();
  const [loaderTimeout, clearLoaderTimeout] = useTimeout();

  const activeChange = useCompare(active);
  const firstRender = useFirstRender();

  const videoInfo = useMemo(() => currentVideo.info!, [currentVideo.info]);

  /*
   * PREVENT DEFAULT
   */

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);

  /*
   * TOGGLE SHOWING CONTROLS
   */

  const hideControlsHandler = useCallback(() => {
    const video = videoRef.current!;

    if (video.paused) return;

    setDisplayControls(false);
  }, []);

  const showControlsHandler = useCallback(() => {
    const video = videoRef.current!;

    setDisplayCursor('default');

    if (!selectorData.current || (selectorData.current && video.paused)) {
      setDisplayControls(true);
    }

    if (video.paused) return;

    controlsTimeout(() => {
      hideControlsHandler();

      if (!video.paused) {
        setDisplayCursor('none');
      }
    }, 2000);
  }, [hideControlsHandler, controlsTimeout]);

  /*
   * PLAYBACK CONTROL
   */

  const togglePlayHandler = useCallback(() => {
    const video = videoRef.current!;

    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }

    showControlsHandler();
  }, [showControlsHandler]);

  const videoPlayHandler = useCallback(() => {
    setPlaybackState(true);
  }, []);

  const videoPauseHandler = useCallback(() => {
    setPlaybackState(false);
  }, []);

  const videoEndedHandler = useCallback(() => {
    if (
      currentVideo.children.length === 0 ||
      !currentVideo.children.find((item) => item.info)
    ) {
      return;
    }

    if (selectedNextVideoId) {
      dispatch(updateActiveVideo(selectedNextVideoId));
    } else {
      const firstValidItem = currentVideo.children.find((item) => item.info);

      firstValidItem && dispatch(updateActiveVideo(firstValidItem.id));
    }
  }, [dispatch, currentVideo.children, selectedNextVideoId]);

  /*
   * LOADING CONTROL
   */

  const showLoaderHandler = useCallback(() => {
    loaderTimeout(() => setDisplayLoader(true), 300);
  }, [loaderTimeout]);

  const hideLoaderHandler = useCallback(() => {
    clearLoaderTimeout();
    setDisplayLoader(false);
  }, [clearLoaderTimeout]);

  /*
   * VOLUME CONTROL
   */

  const volumeInputHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current!;

      video.volume = +event.target.value;
    },
    []
  );

  const volumeChangeHandler = useCallback(() => {
    const video = videoRef.current!;

    setVolumeState(video.volume);

    if (video.volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
      volumeData.current = video.volume;
    }

    if (active) {
      volumeTimeout(() => {
        dispatch(updateVideoVolume(video.volume));
        localStorage.setItem('video-volume', `${video.volume}`);
      }, 300);
    }
  }, [dispatch, active, volumeTimeout]);

  const toggleMuteHandler = useCallback(() => {
    const video = videoRef.current!;

    if (video.volume !== 0) {
      volumeData.current = video.volume;
      video.volume = 0;
      setVolumeState(0);
    } else {
      video.volume = volumeData.current;
      setVolumeState(volumeData.current);
    }
  }, []);

  /*
   * TIME CONTROL
   */

  const timeChangeHandler = useCallback(() => {
    const video = videoRef.current!;

    const duration = video.duration || 0;
    const currentTime = video.currentTime || 0;
    const buffer = video.buffered;

    // Progress
    setCurrentProgress((currentTime / duration) * 100);
    setSeekProgress(currentTime);

    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (
          buffer.start(buffer.length - 1 - i) === 0 ||
          buffer.start(buffer.length - 1 - i) < video.currentTime
        ) {
          setBufferProgress(
            (buffer.end(buffer.length - 1 - i) / duration) * 100
          );
          break;
        }
      }
    }

    // Time
    setCurrentTimeUI(formatTime(Math.round(currentTime)));
    setRemainedTimeUI(
      formatTime(Math.round(duration) - Math.round(currentTime))
    );

    // Selector
    const timelineStart = videoInfo!.timelineStart || duration - 10;
    const timelineEnd = videoInfo!.timelineEnd || timelineStart + 10;

    if (
      currentTime >= timelineStart &&
      currentTime < timelineEnd &&
      currentVideo.children.length > 0 &&
      !selectedNextVideoId
    ) {
      hideControlsHandler();
      setDisplaySelector(true);
      selectorData.current = true;
    } else {
      setDisplaySelector(false);
      selectorData.current = false;
    }
  }, [
    videoInfo,
    currentVideo.children,
    selectedNextVideoId,
    hideControlsHandler,
  ]);

  /*
   * SKIP CONTROL
   */

  const seekMouseMoveHandler = useCallback((event: React.MouseEvent) => {
    const video = videoRef.current!;
    const progress = videoProgressRef.current!;

    const skipTo =
      (event.nativeEvent.offsetX / (event.target as Element).clientWidth) *
      +video.duration;

    progressSeekData.current = skipTo;

    const rect = progress.getBoundingClientRect();

    let newTime;
    if (skipTo > video.duration) {
      newTime = formatTime(video.duration);
    } else if (skipTo < 0) {
      newTime = '00:00';
    } else {
      newTime = formatTime(skipTo);
      setSeekTooltipPosition(`${event.pageX - rect.left}px`);
    }

    setSeekTooltip(newTime);
  }, []);

  const seekInputHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current!;

      const skipTo = progressSeekData.current || +event.target.value;

      video.currentTime = skipTo;
      setCurrentProgress((skipTo / video.duration) * 100);
      setSeekProgress(skipTo);
    },
    []
  );

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullscreenHandler = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.querySelector('.video-tree')!.requestFullscreen();
    }
  }, []);

  const fullscreenChangeHandler = useCallback(() => {
    if (document.fullscreenElement) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  }, []);

  /*
   * SELECTOR
   */

  const selectNextVideoHandler = useCallback(
    (index: number) => {
      const validVideos = currentVideo.children.filter((video) => video.info);
      const selectedVideo = validVideos[index];

      if (!selectedVideo) return;

      setSelectedNextVideoId(selectedVideo.id);
      setDisplaySelector(false);
    },
    [currentVideo.children]
  );

  /*
   * KEYBOARD SHORTKUTS
   */

  const keyEventHandler = useCallback(
    (event: KeyboardEvent) => {
      const video = videoRef.current!;
      const activeElement = document.activeElement;

      if (!activeElement) return;

      if (
        (activeElement.localName === 'input' &&
          (activeElement as HTMLInputElement).type !== 'range') ||
        activeElement.localName === 'textarea'
      ) {
        return;
      }

      const { key } = event;

      switch (key) {
        case 'ArrowRight':
          // Forward 10 seconds
          video.currentTime += 10;
          break;
        case 'ArrowLeft':
          // Rewind 10 seconds
          video.currentTime -= 10;
          break;
        case 'ArrowUp':
          // Volume Up
          if (video.volume + 0.05 > 1) {
            video.volume = 1;
          } else {
            video.volume = +(video.volume + 0.05).toFixed(2);
          }
          break;
        case 'ArrowDown':
          // Volume Down
          if (video.volume - 0.05 < 0) {
            video.volume = 0;
          } else {
            video.volume = +(video.volume - 0.05).toFixed(2);
          }
          break;
        case ' ':
          togglePlayHandler();
          break;

        case '1':
        case '2':
        case '3':
        case '4':
          if (!selectorData.current) return;

          selectNextVideoHandler(+key - 1);
      }

      showControlsHandler();
    },
    [togglePlayHandler, showControlsHandler, selectNextVideoHandler]
  );
  /*
   * INITIALIZE VIDEO
   */

  const videoLoadHandler = useCallback(() => {
    const video = videoRef.current!;

    if (!video.canPlayType) {
      video.controls = true;
      setCanPlayType(false);
    }

    video.volume = videoVolume || 1;

    setVideoDuration(video.duration);

    timeChangeHandler();

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
  }, [videoVolume, timeChangeHandler, fullscreenChangeHandler]);

  /*
   * NAVIGATION
   */

  const restartVideoTreeHandler = useCallback(() => {
    dispatch(updateActiveVideo(treeId));
  }, [dispatch, treeId]);

  const navigateToPreviousVideoHandler = useCallback(() => {
    if (!currentVideo.prevId) return;

    dispatch(updateActiveVideo(currentVideo.prevId));
  }, [dispatch, currentVideo.prevId]);

  const navigateToSelectorTimelineHandler = useCallback(() => {
    const video = videoRef.current!;

    const timelineStart = videoInfo!.timelineStart || video.duration - 10;

    if (video.currentTime < timelineStart) {
      video.currentTime = timelineStart;
    } else {
      video.currentTime = video.duration;
    }

    video.play();
  }, [videoInfo]);

  const markTimelineHandler = useCallback(() => {
    const video = videoRef.current!;
    const { timelineStart, timelineEnd } = videoInfo!;

    if (!timelineMarked) {
      // Mark start point
      dispatch(
        updateNode(
          {
            timelineStart: +video.currentTime.toFixed(2),
          },
          currentVideo.id
        )
      );

      if (video.currentTime > (timelineEnd || 0)) {
        dispatch(
          updateNode(
            {
              timelineEnd: +(
                video.currentTime + 10 > videoDuration
                  ? videoDuration
                  : video.currentTime + 10
              ).toFixed(2),
            },
            currentVideo.id
          )
        );
      }
    } else {
      // Mark end point
      dispatch(
        updateNode(
          {
            timelineEnd: +video.currentTime.toFixed(2),
          },
          currentVideo.id
        )
      );

      if (video.currentTime < (timelineStart || 0)) {
        dispatch(
          updateNode(
            {
              timelineStart: +(
                video.currentTime - 10 < 0 ? 0 : video.currentTime - 10
              ).toFixed(2),
            },
            currentVideo.id
          )
        );
      }
    }

    setTimelineMarked((prev) => !prev);
  }, [dispatch, currentVideo.id, videoInfo, timelineMarked, videoDuration]);

  /*
   * USEEFFECT
   */

  useEffect(() => {
    (async () => {
      try {
        const video = videoRef.current!;
        let src = videoInfo.url;

        // Edit mode
        if (src.substr(0, 4) === 'blob') {
          return video.setAttribute('src', src);
        }

        videoInfo.isConverted
          ? // set domain to souce bucket
            (src = `${process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED}/${src}`)
          : // set domain to cloudfront domain
            (src = `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${src}`);

        // Connect video to Shaka Player
        const player = new shaka.Player(video);

        // Try to load a manifest (async process).
        await player.load(src);
      } catch (err) {
        alert(err);
      }
    })();
  }, [videoInfo.isConverted, videoInfo.url]);

  useEffect(() => {
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, [fullscreenChangeHandler]);

  useEffect(() => {
    if (active) return;

    const video = videoRef.current!;

    video.volume = videoVolume;
    setDisplayControls(false);
  }, [active, videoVolume]);

  useEffect(() => {
    if (firstRender || !activeChange) return;

    const video = videoRef.current!;

    if (active) {
      video.play();
      setDisplayCursor('none');
    } else {
      video.currentTime = 0;
      video.pause();
    }
  }, [firstRender, active, activeChange]);

  useEffect(() => {
    if (active) {
      document.addEventListener('keydown', keyEventHandler);
    } else {
      document.removeEventListener('keydown', keyEventHandler);
    }

    return () => {
      document.removeEventListener('keydown', keyEventHandler);
    };
  }, [active, keyEventHandler]);

  /*
   * RENDER
   */

  return (
    <div
      className="vp-container"
      ref={videoContainerRef}
      style={{ cursor: displayCursor }}
      onMouseMove={showControlsHandler}
      onMouseLeave={hideControlsHandler}
      // onContextMenu={preventDefault}
    >
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        onLoadedMetadata={videoLoadHandler}
        onClick={togglePlayHandler}
        onPlay={videoPlayHandler}
        onPause={videoPauseHandler}
        onEnded={videoEndedHandler}
        onVolumeChange={volumeChangeHandler}
        onTimeUpdate={timeChangeHandler}
        onDoubleClick={toggleFullscreenHandler}
        onWaiting={showLoaderHandler}
        onCanPlay={hideLoaderHandler}
      />

      <div
        className={`vp-controls${!canPlayType ? ' hidden' : ''}${
          !displayControls ? ' hide' : ''
        }`}
      >
        <div className="vp-controls__header">
          <Time time={currentTimeUI} />
          <Progress
            ref={videoProgressRef}
            bufferProgress={bufferProgress}
            currentProgress={currentProgress}
            videoDuration={videoDuration}
            seekProgress={seekProgress}
            seekTooltip={seekTooltip}
            seekTooltipPosition={seekTooltipPosition}
            timelineStart={videoInfo!.timelineStart}
            timelineEnd={videoInfo!.timelineEnd}
            editMode={editMode}
            onHover={seekMouseMoveHandler}
            onSeek={seekInputHandler}
            onKey={preventDefault}
          />
          <Time time={remainedTimeUI} />
        </div>

        <div className="vp-controls__body">
          <Volume
            volume={volumeState}
            onToggle={toggleMuteHandler}
            onSeek={volumeInputHandler}
            onKey={preventDefault}
          />
          <Playback
            play={playbackState}
            onToggle={togglePlayHandler}
            onKey={preventDefault}
          />
          <Fullscreen
            fullscreenState={fullscreen}
            onToggle={toggleFullscreenHandler}
            onKey={preventDefault}
          />
        </div>
      </div>

      <Selector
        on={displaySelector}
        high={displayControls}
        next={currentVideo.children}
        onSelect={selectNextVideoHandler}
      />

      <Loader on={displayLoader} />

      {editMode && (
        <Navigation
          currentId={currentVideo.id}
          treeId={treeId}
          marked={timelineMarked}
          onRestart={restartVideoTreeHandler}
          onPrev={navigateToPreviousVideoHandler}
          onNext={navigateToSelectorTimelineHandler}
          onMark={markTimelineHandler}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
