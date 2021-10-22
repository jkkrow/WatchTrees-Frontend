import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import Playback from "./Controls/Playback";
import Volume from "./Controls/Volume";
import Progress from "./Controls/Progress";
import Time from "./Controls/Time";
import Fullscreen from "./Controls/Fullscreen";
import Selector from "./Controls/Selector";
import Navigation from "./Controls/Navigation";
import Loader from "./Controls/Loader";
import { useTimeout } from "hooks/use-timer";
import { formatTime } from "util/format";
import { updateActiveVideo, updateVideoVolume } from "store/actions/video";
import { updateNode } from "store/actions/upload";
import "./VideoPlayer.scss";

const shaka = require("shaka-player/dist/shaka-player.ui.js");

const VideoPlayer = ({ currentVideo, autoPlay, editMode, active }) => {
  // vp-container
  const [displayCursor, setDisplayCursor] = useState("default");

  // vp-controls
  const [canPlayType, setCanPlayType] = useState(true);
  const [displayControls, setDisplayControls] = useState(true);

  // playback button
  const [playbackState, setPlaybackState] = useState("play");

  // volume button
  const [volumeState, setVolumeState] = useState("high");

  // volume input
  const [currentVolume, setCurrentVolume] = useState("100");
  const [seekVolume, setSeekVolume] = useState(1);

  // progress bar
  const [currentProgress, setCurrentProgress] = useState(0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [seekProgress, setSeekProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // seek tooltip
  const [seekTooltip, setSeekTooltip] = useState("00:00");
  const [seekTooltipPosition, setSeekTooltipPosition] = useState("");

  // time ui
  const [currentTimeUI, setCurrentTimeUI] = useState("00:00");
  const [remainedTimeUI, setRemainedTimeUI] = useState("00:00");

  // fullscreen button
  const [fullscreen, setFullscreen] = useState(false);

  // vp-loader
  const [displayLoader, setDisplayLoader] = useState(true);

  // vp-selector
  const [displaySelector, setDisplaySelector] = useState(false);
  const [selectedNextVideo, setSelectedNextVideo] = useState(null);

  // vp-navigation
  const [timelineMarked, setTimelineMarked] = useState(false);

  const { videoTree, activeVideoId, videoVolume } = useSelector(
    (state) => state.video
  );

  const videoRef = useRef();
  const videoContainerRef = useRef();
  const videoProgressRef = useRef();
  const videoSelectorRef = useRef();

  const volumeData = useRef(videoVolume || 1);
  const progressSeekData = useRef();
  const selectorData = useRef();

  const [controlsTimeout] = useTimeout();
  const [volumeTimeout] = useTimeout();
  const [loaderTimeout, clearLoaderTimeout] = useTimeout();

  const dispatch = useDispatch();

  /*
   * PREVENT DEFAULT
   */

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);

  /*
   * ERROR HANDLER
   */

  const errorHandler = useCallback((event) => {
    // Extract the shaka.util.Error object from the event.
    console.log("Error code", event.detail.code, "object", event.detail);
  }, []);

  /*
   * TOGGLE SHOWING CONTROLS
   */

  const hideControlsHandler = useCallback(() => {
    if (videoRef.current.paused) return;

    setDisplayControls(false);
  }, []);

  const showControlsHandler = useCallback(() => {
    setDisplayCursor("default");

    if (
      !selectorData.current ||
      (selectorData.current && videoRef.current.paused)
    ) {
      setDisplayControls(true);
    }

    if (videoRef.current.paused) return;

    controlsTimeout(() => {
      hideControlsHandler();

      if (!videoRef.current.paused) {
        setDisplayCursor("none");
      }
    }, 2000);
  }, [hideControlsHandler, controlsTimeout]);

  /*
   * PLAYBACK CONTROL
   */

  const togglePlayHandler = useCallback(() => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }

    showControlsHandler();
  }, [showControlsHandler]);

  const videoPlayHandler = useCallback(() => {
    setPlaybackState("pause");
  }, []);

  const videoPauseHandler = useCallback(() => {
    setPlaybackState("play");
  }, []);

  const videoEndedHandler = useCallback(() => {
    if (
      currentVideo.children.length === 0 ||
      !currentVideo.children.find((item) => item.info)
    ) {
      return;
    }

    if (selectedNextVideo) {
      dispatch(updateActiveVideo(selectedNextVideo.id));
    } else {
      dispatch(
        updateActiveVideo(currentVideo.children.find((item) => item.info).id)
      );
    }
  }, [dispatch, currentVideo.children, selectedNextVideo]);

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

  const volumeInputHandler = useCallback((event) => {
    videoRef.current.volume = event.target.value;
    setCurrentVolume(event.target.value * 100 + "%");
    setSeekVolume(event.target.value);
  }, []);

  const volumeChangeHandler = useCallback(() => {
    const video = videoRef.current;

    setCurrentVolume(video.volume * 100 + "%");
    setSeekVolume(video.volume);

    if (video.volume === 0) {
      video.muted = true;
    } else {
      video.muted = false;
      volumeData.current = video.volume;
    }

    if (video.muted || video.volume === 0) {
      setVolumeState("mute");
    } else if (video.volume > 0 && video.volume < 0.3) {
      setVolumeState("low");
    } else if (video.volume >= 0.3 && video.volume < 0.7) {
      setVolumeState("middle");
    } else {
      setVolumeState("high");
    }

    if (active) {
      volumeTimeout(() => {
        dispatch(updateVideoVolume(video.volume));
        localStorage.setItem("video-volume", video.volume);
      }, 300);
    }
  }, [dispatch, active, volumeTimeout]);

  const toggleMuteHandler = useCallback(() => {
    if (videoRef.current.volume !== 0) {
      volumeData.current = videoRef.current.volume;
      videoRef.current.volume = 0;
      setCurrentVolume("0");
      setSeekVolume(0);
    } else {
      videoRef.current.volume = volumeData.current;
      setSeekVolume(volumeData.current);
      setCurrentVolume(volumeData.current * 100 + "%");
    }
  }, []);

  /*
   * TIME CONTROL
   */

  const timeChangeHandler = useCallback(() => {
    const duration = videoRef.current.duration || 0;
    const currentTime = videoRef.current.currentTime || 0;
    const buffer = videoRef.current.buffered;

    // Progress
    setCurrentProgress((currentTime / duration) * 100);
    setSeekProgress(currentTime);

    if (duration > 0) {
      for (let i = 0; i < buffer.length; i++) {
        if (
          buffer.start(buffer.length - 1 - i) === 0 ||
          buffer.start(buffer.length - 1 - i) < videoRef.current.currentTime
        ) {
          setBufferProgress(
            (buffer.end(buffer.length - 1 - i) / duration) * 100
          );
          break;
        }
      }
    }

    // Time
    setCurrentTimeUI(formatTime(parseInt(currentTime)));
    setRemainedTimeUI(formatTime(parseInt(duration) - parseInt(currentTime)));

    // Selector
    const timelineStart = currentVideo.info.timelineStart || duration - 10;
    const timelineEnd = currentVideo.info.timelineEnd || timelineStart + 10;

    if (
      currentTime >= timelineStart &&
      currentTime < timelineEnd &&
      currentVideo.children.length > 0 &&
      !selectedNextVideo
    ) {
      hideControlsHandler();
      setDisplaySelector(true);
      selectorData.current = true;
    } else {
      setDisplaySelector(false);
      selectorData.current = false;
    }
  }, [currentVideo, selectedNextVideo, hideControlsHandler]);

  /*
   * SKIP CONTROL
   */

  const seekMouseMoveHandler = useCallback((event) => {
    const skipTo =
      (event.nativeEvent.offsetX / event.target.clientWidth) *
      +videoRef.current.duration;

    progressSeekData.current = skipTo;

    const rect = videoProgressRef.current.getBoundingClientRect();

    let newTime;
    if (skipTo > videoRef.current.duration) {
      newTime = formatTime(videoRef.current.duration);
    } else if (skipTo < 0) {
      newTime = "00:00";
    } else {
      newTime = formatTime(skipTo);
      setSeekTooltipPosition(`${event.pageX - rect.left}px`);
    }

    setSeekTooltip(newTime);
  }, []);

  const seekInputHandler = useCallback((event) => {
    const skipTo = progressSeekData.current || event.target.value;

    videoRef.current.currentTime = skipTo;
    setCurrentProgress((skipTo / videoRef.current.duration) * 100);
    setSeekProgress(skipTo);
  }, []);

  /*
   * FULLSCREEN CONTROL
   */

  const toggleFullscreenHandler = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.querySelector(".video-tree").requestFullscreen();
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
   * KEYBOARD SHORTKUTS
   */

  const keyEventHandler = useCallback(
    (event) => {
      const activeElement = document.activeElement;

      if (
        (activeElement.localName === "input" &&
          activeElement.type !== "range") ||
        activeElement.localName === "textarea"
      ) {
        return;
      }

      const { key } = event;

      switch (key) {
        case "ArrowRight":
          // Forward 10 seconds
          videoRef.current.currentTime += 10;
          break;
        case "ArrowLeft":
          // Rewind 10 seconds
          videoRef.current.currentTime -= 10;
          break;
        case "ArrowUp":
          // Volume Up
          if (videoRef.current.volume + 0.05 > 1) {
            videoRef.current.volume = 1;
          } else {
            videoRef.current.volume = (videoRef.current.volume + 0.05).toFixed(
              2
            );
          }
          break;
        case "ArrowDown":
          // Volume Down
          if (videoRef.current.volume - 0.05 < 0) {
            videoRef.current.volume = 0;
          } else {
            videoRef.current.volume = (videoRef.current.volume - 0.05).toFixed(
              2
            );
          }
          break;
        case " ":
          togglePlayHandler();
          break;

        case "1":
          if (!selectorData.current) return;
          videoSelectorRef.current.children[0]?.click();
          break;
        case "2":
          if (!selectorData.current) return;
          videoSelectorRef.current.children[1]?.click();
          break;
        case "3":
          if (!selectorData.current) return;
          videoSelectorRef.current.children[2]?.click();
          break;
        case "4":
          if (!selectorData.current) return;
          videoSelectorRef.current.children[3]?.click();
          break;
        default:
          return;
      }

      showControlsHandler();
    },
    [togglePlayHandler, showControlsHandler]
  );
  /*
   * INITIALIZE VIDEO
   */

  const videoLoadHandler = useCallback(() => {
    if (!videoRef.current.canPlayType) {
      videoRef.current.controls = true;
      setCanPlayType(false);
    }

    videoRef.current.volume = localStorage.getItem("video-volume") || 1;
    setCurrentVolume(
      localStorage.getItem("video-volume") * 100 + "%" || "100%"
    );

    setVideoDuration(videoRef.current.duration);

    timeChangeHandler();

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);
  }, [timeChangeHandler, fullscreenChangeHandler]);

  /*
   * SELECTOR
   */

  const selectNextVideoHandler = useCallback((video) => {
    setSelectedNextVideo(video);
    setDisplaySelector(false);
  }, []);

  /*
   * NAVIGATION
   */

  const restartVideoTreeHandler = useCallback(() => {
    dispatch(updateActiveVideo(videoTree.root.id));
  }, [dispatch, videoTree.root]);

  const navigateToPreviousVideoHandler = useCallback(() => {
    dispatch(updateActiveVideo(currentVideo.prevId));
  }, [dispatch, currentVideo.prevId]);

  const navigateToSelectorTimelineHandler = useCallback(() => {
    const timelineStart =
      currentVideo.info.timelineStart || videoRef.current.duration - 10;

    if (videoRef.current.currentTime < timelineStart) {
      videoRef.current.currentTime = timelineStart;
    } else {
      videoRef.current.currentTime = videoRef.current.duration;
    }

    videoRef.current.play();
  }, [currentVideo.info]);

  const markTimelineHandler = useCallback(() => {
    if (!timelineMarked) {
      // Mark start point

      dispatch(
        updateNode(
          {
            timelineStart: +videoRef.current.currentTime.toFixed(2),
          },
          currentVideo.id
        )
      );

      if (videoRef.current.currentTime > currentVideo.info.timelineEnd) {
        dispatch(
          updateNode(
            {
              timelineEnd: +(
                videoRef.current.currentTime + 10 > videoDuration
                  ? videoDuration
                  : videoRef.current.currentTime + 10
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
            timelineEnd: +videoRef.current.currentTime.toFixed(2),
          },
          currentVideo.id
        )
      );

      if (videoRef.current.currentTime < currentVideo.info.timelineStart) {
        dispatch(
          updateNode(
            {
              timelineStart: +(
                videoRef.current.currentTime - 10 < 0
                  ? 0
                  : videoRef.current.currentTime - 10
              ).toFixed(2),
            },
            currentVideo.id
          )
        );
      }
    }

    setTimelineMarked((prev) => !prev);
  }, [dispatch, currentVideo, timelineMarked, videoDuration]);

  /*
   * USEEFFECT
   */

  useEffect(() => {
    (async () => {
      try {
        const src = currentVideo.info.url;

        // Edit mode
        if (src.substr(0, 4) === "blob") {
          return videoRef.current.setAttribute("src", src);
        }

        // Connect video to Shaka Player
        const player = new shaka.Player(videoRef.current);

        // Try to load a manifest (async process).
        await player.load(src);
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [currentVideo.info.url]);

  useEffect(() => {
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    };
  }, [fullscreenChangeHandler]);

  useEffect(() => {
    if (!active) {
      videoRef.current.volume = videoVolume;
      setDisplayControls(false);
    }
  }, [active, videoVolume]);

  useLayoutEffect(() => {
    if (active) {
      videoRef.current.play();
      setDisplayCursor("none");
      document.addEventListener("keydown", keyEventHandler);
    }

    if (!active) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
      document.removeEventListener("keydown", keyEventHandler);
    }

    return () => {
      document.removeEventListener("keydown", keyEventHandler);
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
        onError={errorHandler}
      />

      <div
        className={`vp-controls${!canPlayType ? " hidden" : ""}${
          !displayControls ? " hide" : ""
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
            timelineStart={currentVideo.info.timelineStart}
            timelineEnd={currentVideo.info.timelineEnd}
            editMode={editMode}
            onHover={seekMouseMoveHandler}
            onSeek={seekInputHandler}
            onKey={preventDefault}
          />
          <Time time={remainedTimeUI} />
        </div>

        <div className="vp-controls__body">
          <Volume
            volumeState={volumeState}
            currentVolume={currentVolume}
            seekVolume={seekVolume}
            onToggle={toggleMuteHandler}
            onSeek={volumeInputHandler}
            onKey={preventDefault}
          />
          <Playback
            playbackState={playbackState}
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
        ref={videoSelectorRef}
        high={displayControls}
        next={currentVideo.children}
        onSelect={selectNextVideoHandler}
      />

      <Loader on={displayLoader} />

      {editMode && (
        <Navigation
          activeVideoId={activeVideoId}
          videoTree={videoTree}
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
