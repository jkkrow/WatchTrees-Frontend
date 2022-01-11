import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import shaka from 'shaka-player';

import Playback from './UI/Controls/Playback/Playback';
import Volume from './UI/Controls/Volume/Volume';
import Progress from './UI/Controls/Progress/Progress';
import Time from './UI/Controls/Time/Time';
import Fullscreen from './UI/Controls/Fullscreen/Fullscreen';
import Settings from './UI/Controls/Settings/Settings';
import Selector from './UI/Selector/Selector';
import Navigation from './UI/Navigation/Navigation';
import Loader from './UI/Loader/Loader';
import KeyAction from './UI/KeyAction/KeyAction';
import { useTimeout, useInterval } from 'hooks/timer-hook';
import { useCompare, useFirstRender } from 'hooks/cycle-hook';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import { VideoNode, videoActions } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';
import { addToHistory } from 'store/thunks/video-thunk';
import { formatTime } from 'util/format';
import './VideoPlayer.scss';

interface VideoPlayerProps {
  currentVideo: VideoNode;
  videoId: string;
  rootId: string;
  autoPlay: boolean;
  editMode: boolean;
  active: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  videoId,
  rootId,
  autoPlay,
  editMode,
  active,
}) => {
  const {
    activeVideoId,
    initialProgress,
    videoVolume,
    videoResolution,
    videoPlaybackRate,
  } = useAppSelector((state) => state.video);
  const { dispatch } = useAppDispatch();

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

  // resolutions
  const [resolutions, setResolutions] = useState<shaka.extern.TrackList>([]);
  const [activeResolution, setActiveResolution] = useState<number | 'auto'>(
    videoResolution || 'auto'
  );

  // playbackRate
  const [playbackRates] = useState([0.5, 0.75, 1, 1.25, 1.5]);
  const [activePlaybackRate, setActivePlaybackRate] = useState(
    videoPlaybackRate || 1
  );

  // vp-loader
  const [displayLoader, setDisplayLoader] = useState(true);

  // vp-selector
  const [displaySelector, setDisplaySelector] = useState(false);
  const [selectedNextVideoId, setSelectedNextVideoId] = useState<string>('');

  // vp-key-action
  const [displayKeyAction, setDisplayKeyAction] = useState(false);

  // vp-navigation
  const [selectionTimeMarked, setSelectionTimeMarked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoProgressRef = useRef<HTMLDivElement>(null);

  const shakaPlayer = useRef<shaka.Player>();
  const volumeData = useRef(videoVolume || 1);
  const progressSeekData = useRef(0);
  const selectorData = useRef(false);

  const [setControlsTimeout] = useTimeout();
  const [setVolumeTimeout] = useTimeout();
  const [setKeyActionSkipTimeout] = useTimeout();
  const [setKeyActionVolumeTimeout] = useTimeout();
  const [setLoaderTimeout, clearLoaderTimeout] = useTimeout();
  const [setHistoryInterval, clearHistoryInterval] = useInterval();
  const [setResolutionInterval, clearResolutionInterval] = useInterval();

  const activeChange = useCompare(active);
  const firstRender = useFirstRender();

  const videoInfo = useMemo(() => currentVideo.info!, [currentVideo.info]);

  /**
   * PREVENT DEFAULT
   */

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);

  /**
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

    setControlsTimeout(() => {
      hideControlsHandler();

      if (!video.paused) {
        setDisplayCursor('none');
      }
    }, 2000);
  }, [hideControlsHandler, setControlsTimeout]);

  /**
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
    const video = videoRef.current!;
    setPlaybackState(true);

    if (editMode) return;

    // Update history
    setHistoryInterval(
      () => {
        const endPoint =
          video.duration * 0.95 > video.duration - 10
            ? video.duration - 10
            : video.duration * 0.95;
        const isLastVideo = currentVideo.children.length === 0;
        const endTime = video.duration - endPoint > 180 ? 180 : endPoint;
        const isEnded =
          isLastVideo && video.currentTime > endTime ? true : false;

        const history = {
          video: videoId,
          progress: {
            activeVideoId: currentVideo.id,
            time: video.currentTime,
            isEnded: isEnded,
          },
          updatedAt: new Date(),
        };

        dispatch(addToHistory(history));
      },
      5000,
      true
    );

    // Update Resolution
    setResolutionInterval(() => {
      const player = shakaPlayer.current;

      if (!player) return;

      setResolutions(player.getVariantTracks());
    }, 5000);
  }, [
    editMode,
    currentVideo.id,
    currentVideo.children,
    videoId,
    dispatch,
    setHistoryInterval,
    setResolutionInterval,
  ]);

  const videoPauseHandler = useCallback(() => {
    setPlaybackState(false);

    if (editMode) return;

    clearHistoryInterval();
    clearResolutionInterval();
  }, [editMode, clearHistoryInterval, clearResolutionInterval]);

  const videoEndedHandler = useCallback(() => {
    const video = videoRef.current!;
    const isLastVideo =
      currentVideo.children.length === 0 ||
      !currentVideo.children.find((item) => item.info);

    if (isLastVideo) {
      const history = {
        video: videoId,
        progress: {
          activeVideoId: currentVideo.id,
          time: video.currentTime,
          isEnded: true,
        },
        updatedAt: new Date(),
      };

      dispatch(addToHistory(history));

      return;
    }

    if (selectedNextVideoId) {
      dispatch(videoActions.setActiveVideo(selectedNextVideoId));
    } else {
      const firstValidItem = currentVideo.children.find((item) => item.info);

      firstValidItem &&
        dispatch(videoActions.setActiveVideo(firstValidItem.id));
    }
  }, [
    dispatch,
    videoId,
    currentVideo.id,
    currentVideo.children,
    selectedNextVideoId,
  ]);

  /**
   * LOADING CONTROL
   */

  const showLoaderHandler = useCallback(() => {
    setLoaderTimeout(() => setDisplayLoader(true), 300);
  }, [setLoaderTimeout]);

  const hideLoaderHandler = useCallback(() => {
    clearLoaderTimeout();
    setDisplayLoader(false);
  }, [clearLoaderTimeout]);

  /**
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
      setVolumeTimeout(() => {
        dispatch(videoActions.setVideoVolume(video.volume));
        localStorage.setItem('video-volume', `${video.volume}`);
      }, 300);
    }
  }, [dispatch, active, setVolumeTimeout]);

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

  /**
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
    const selectionTimeStart = videoInfo!.selectionTimeStart || duration - 10;
    const selectionTimeEnd =
      videoInfo!.selectionTimeEnd || selectionTimeStart + 10;

    if (
      currentTime >= selectionTimeStart &&
      currentTime < selectionTimeEnd &&
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

  /**
   * SKIP CONTROL
   */

  const seekMouseMoveHandler = useCallback((event: React.MouseEvent) => {
    const video = videoRef.current!;
    const progress = videoProgressRef.current!;

    const skipTo =
      (event.nativeEvent.offsetX / progress.offsetWidth) * video.duration;

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

  /**
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

  /**
   * Settings
   */

  const changeResolutionHandler = useCallback(
    (resolution: shaka.extern.Track | 'auto') => {
      const player = shakaPlayer.current!;
      let resolutionHeight: number | 'auto' = 'auto';

      if (resolution === 'auto') {
        player.configure({ abr: { enabled: true } });
      } else {
        player.configure({ abr: { enabled: false } });
        player.selectVariantTrack(resolution);

        resolutionHeight = resolution.height as number;
      }

      setActiveResolution(resolutionHeight);
      dispatch(videoActions.setVideoResolution(resolutionHeight));
    },
    [dispatch]
  );

  const changePlaybackRateHandler = useCallback(
    (playbackRate: number) => {
      const video = videoRef.current!;

      video.playbackRate = playbackRate;
      setActivePlaybackRate(playbackRate);
      dispatch(videoActions.setVideoPlaybackRate(playbackRate));
    },
    [dispatch]
  );

  /**
   * KEYBOARD SHORTKUTS
   */

  const keyEventHandler = useCallback(
    (event: KeyboardEvent) => {
      const video = videoRef.current!;
      const activeElement = document.activeElement;

      if (
        !activeElement ||
        (activeElement.localName === 'input' &&
          (activeElement as HTMLInputElement).type !== 'range') ||
        activeElement.localName === 'textarea'
      ) {
        return;
      }

      const { key } = event;

      switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();

          video.currentTime =
            key === 'ArrowLeft'
              ? video.currentTime - 10
              : video.currentTime + 10;

          const rewind = document.querySelector(
            '.vp-key-action__skip.rewind'
          ) as HTMLElement;
          const forward = document.querySelector(
            '.vp-key-action__skip.forward'
          ) as HTMLElement;

          const targetContainer = key === 'ArrowLeft' ? rewind : forward;
          const targetElement =
            targetContainer.firstElementChild as HTMLElement;

          targetContainer.style.display = 'flex';
          targetContainer.animate(
            [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }],
            {
              duration: 1000,
              easing: 'ease-out',
              fill: 'forwards',
            }
          );
          targetElement.animate(
            [
              { opacity: 1, transform: 'translateX(0)' },
              {
                opacity: 0,
                transform: `translateX(${
                  key === 'ArrowLeft' ? '-20%' : '20%'
                })`,
              },
            ],
            {
              duration: 1000,
              easing: 'ease-in-out',
              fill: 'forwards',
            }
          );
          setKeyActionSkipTimeout(() => {
            rewind.style.display = 'none';
            forward.style.display = 'none';
          }, 1000);

          break;
        case 'ArrowUp':
          event.preventDefault();

          if (video.volume + 0.05 > 1) {
            video.volume = 1;
          } else {
            video.volume = +(video.volume + 0.05).toFixed(2);
          }

          setDisplayKeyAction(true);
          setKeyActionVolumeTimeout(() => {
            setDisplayKeyAction(false);
          }, 1500);

          break;
        case 'ArrowDown':
          event.preventDefault();

          if (video.volume - 0.05 < 0) {
            video.volume = 0;
          } else {
            video.volume = +(video.volume - 0.05).toFixed(2);
          }

          setDisplayKeyAction(true);
          setKeyActionVolumeTimeout(() => {
            setDisplayKeyAction(false);
          }, 1500);

          break;
        case ' ':
          event.preventDefault();

          togglePlayHandler();
          break;

        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();

          if (!selectorData.current) return;

          selectNextVideoHandler(+key - 1);
      }
    },
    [
      togglePlayHandler,
      selectNextVideoHandler,
      setKeyActionSkipTimeout,
      setKeyActionVolumeTimeout,
    ]
  );

  /**
   * INITIALIZE VIDEO
   */

  const videoLoadHandler = useCallback(() => {
    const video = videoRef.current!;
    const player = shakaPlayer.current;

    if (!video.canPlayType) {
      video.controls = true;
      setCanPlayType(false);
    }

    video.volume = videoVolume || 1;
    video.playbackRate = videoPlaybackRate || 1;

    if (player && videoResolution !== 'auto') {
      const tracks = player.getVariantTracks();
      const matchedResolution = tracks.find(
        (track) => track.height === videoResolution
      );

      if (matchedResolution) {
        player.configure({ abr: { enabled: false } });
        player.selectVariantTrack(matchedResolution);
      }
    }

    setVideoDuration(video.duration);
    timeChangeHandler();

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
  }, [
    videoVolume,
    videoPlaybackRate,
    videoResolution,
    timeChangeHandler,
    fullscreenChangeHandler,
  ]);

  /**
   * NAVIGATION
   */

  const restartVideoTreeHandler = useCallback(() => {
    dispatch(videoActions.setActiveVideo(rootId));
  }, [dispatch, rootId]);

  const navigateToPreviousVideoHandler = useCallback(() => {
    if (!currentVideo.prevId) return;

    dispatch(videoActions.setActiveVideo(currentVideo.prevId));
  }, [dispatch, currentVideo.prevId]);

  const navigateToSelectorSelectionTimeHandler = useCallback(() => {
    const video = videoRef.current!;

    const selectionTimeStart =
      videoInfo!.selectionTimeStart || video.duration - 10;

    if (video.currentTime < selectionTimeStart) {
      video.currentTime = selectionTimeStart;
    } else {
      video.currentTime = video.duration;
    }

    video.play();
  }, [videoInfo]);

  const markSelectionTimeHandler = useCallback(() => {
    const video = videoRef.current!;
    const { selectionTimeStart, selectionTimeEnd } = videoInfo!;

    if (!selectionTimeMarked) {
      // Mark start point
      dispatch(
        uploadActions.setNode({
          info: {
            selectionTimeStart: +video.currentTime.toFixed(2),
          },
          nodeId: currentVideo.id,
        })
      );

      if (video.currentTime > (selectionTimeEnd || 0)) {
        dispatch(
          uploadActions.setNode({
            info: {
              selectionTimeEnd: +(
                video.currentTime + 10 > videoDuration
                  ? videoDuration
                  : video.currentTime + 10
              ).toFixed(2),
            },
            nodeId: currentVideo.id,
          })
        );
      }
    } else {
      // Mark end point
      dispatch(
        uploadActions.setNode({
          info: {
            selectionTimeEnd: +video.currentTime.toFixed(2),
          },
          nodeId: currentVideo.id,
        })
      );

      if (video.currentTime < (selectionTimeStart || 0)) {
        dispatch(
          uploadActions.setNode({
            info: {
              selectionTimeStart: +(
                video.currentTime - 10 < 0 ? 0 : video.currentTime - 10
              ).toFixed(2),
            },
            nodeId: currentVideo.id,
          })
        );
      }
    }

    setSelectionTimeMarked((prev) => !prev);
  }, [
    dispatch,
    currentVideo.id,
    videoInfo,
    selectionTimeMarked,
    videoDuration,
  ]);

  /**
   * USEEFFECT
   */

  useEffect(() => {
    (async () => {
      if (!firstRender) return;

      console.log('run');

      const video = videoRef.current!;
      let src = videoInfo.url;
      let startTime = 0;

      // Edit mode
      if (src.substring(0, 4) === 'blob') {
        return video.setAttribute('src', src);
      }

      src = videoInfo.isConverted
        ? `${process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED}/${src}`
        : `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${src}`;

      // Connect video to Shaka Player
      const player = new shaka.Player(video);

      if (activeVideoId === currentVideo.id && initialProgress > 0) {
        startTime = initialProgress;
      }

      await player.load(src, startTime);

      shakaPlayer.current = player;

      setResolutions(player.getVariantTracks());
    })();
  }, [
    currentVideo.id,
    videoInfo.isConverted,
    videoInfo.url,
    activeVideoId,
    initialProgress,
    firstRender,
  ]);

  useEffect(() => {
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, [fullscreenChangeHandler]);

  useEffect(() => {
    if (active) return;

    const video = videoRef.current!;
    video.volume = videoVolume;
  }, [active, videoVolume]);

  useEffect(() => {
    const player = shakaPlayer.current;

    if (active || !player) return;

    if (videoResolution === 'auto') {
      player.configure({ abr: { enabled: true } });
      setActiveResolution(videoResolution);
      return;
    }

    const tracks = player.getVariantTracks();
    const matchedResolution = tracks.find(
      (track) => track.height === videoResolution
    );

    if (matchedResolution) {
      player.configure({ abr: { enabled: false } });
      player.selectVariantTrack(matchedResolution);
      setActiveResolution(videoResolution);
    }
  }, [active, videoResolution]);

  useEffect(() => {
    if (active) return;

    const video = videoRef.current!;

    video.playbackRate = videoPlaybackRate;
    setActivePlaybackRate(videoPlaybackRate);
  }, [active, videoPlaybackRate]);

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

  /**
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
      <Loader on={displayLoader} />
      <KeyAction on={displayKeyAction} volume={volumeState} />
      <Selector
        on={displaySelector}
        high={displayControls}
        next={currentVideo.children}
        onSelect={selectNextVideoHandler}
      />
      <div
        className={`vp-controls${!canPlayType ? ' hidden' : ''}${
          !displayControls ? ' hide' : ''
        }`}
        onMouseDown={showControlsHandler}
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
            selectionTimeStart={videoInfo!.selectionTimeStart}
            selectionTimeEnd={videoInfo!.selectionTimeEnd}
            editMode={editMode}
            onHover={seekMouseMoveHandler}
            onSeek={seekInputHandler}
            onKey={preventDefault}
          />
          <Time time={remainedTimeUI} />
        </div>
        <div className="vp-controls__body">
          <div className="vp-controls__body__left">
            <Volume
              volume={volumeState}
              onToggle={toggleMuteHandler}
              onSeek={volumeInputHandler}
              onKey={preventDefault}
            />
          </div>
          <div className="vp-controls__body__center">
            <Playback
              play={playbackState}
              onToggle={togglePlayHandler}
              onKey={preventDefault}
            />
          </div>
          <div className="vp-controls__body__right">
            <Settings
              resolutions={resolutions}
              playbackRates={playbackRates}
              activeResolution={activeResolution}
              activePlaybackRate={activePlaybackRate}
              onChangeResolution={changeResolutionHandler}
              onChangePlaybackRate={changePlaybackRateHandler}
            />
            <Fullscreen
              fullscreenState={fullscreen}
              onToggle={toggleFullscreenHandler}
              onKey={preventDefault}
            />
          </div>
        </div>
      </div>

      {editMode && (
        <Navigation
          currentId={currentVideo.id}
          rootId={rootId}
          marked={selectionTimeMarked}
          onRestart={restartVideoTreeHandler}
          onPrev={navigateToPreviousVideoHandler}
          onNext={navigateToSelectorSelectionTimeHandler}
          onMark={markSelectionTimeHandler}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
