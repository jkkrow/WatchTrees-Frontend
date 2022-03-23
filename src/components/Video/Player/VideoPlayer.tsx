import { useCallback, useRef, useMemo } from 'react';

import Controls from './Controls/Controls';
import VideoHeader from './UI/Header/VideoHeader';
import Playback from './Controls/Playback/Playback';
import Skip from './Controls/Skip/Skip';
import Rewind from './Controls/Rewind/Rewind';
import Volume from './Controls/Volume/Volume';
import Progress from './Controls/Progress/Progress';
import Time from './Controls/Time/Time';
import Fullscreen from './Controls/Fullscreen/Fullscreen';
import Settings from './Controls/Settings/Settings';
import Records from './Controls/Records/Records';
import Marker from './Controls/Marker/Marker';
import Dropdown from './Controls/Dropdown/Dropdown';
import Selector from './UI/Selector/Selector';
import Loader from './UI/Loader/Loader';
import KeyAction from './UI/KeyAction/KeyAction';
import Error from './UI/Error/Error';
import { usePlayer } from 'hooks/video/player';
import { useControls } from 'hooks/video/controls';
import { usePlayback } from 'hooks/video/playback';
import { useHistory } from 'hooks/video/history';
import { PlayerNode } from 'store/slices/video-slice';
import { useResolution } from 'hooks/video/resolution';
import { useVolume } from 'hooks/video/volume';
import { useTime } from 'hooks/video/time';
import { useProgress } from 'hooks/video/progress';
import { useLoader } from 'hooks/video/loader';
import { useSelector } from 'hooks/video/selector';
import { useFullscreen } from 'hooks/video/fullscreen';
import { useSettings } from 'hooks/video/settings';
import { usePlaybackRate } from 'hooks/video/playback-rate';
import { useError } from 'hooks/video/error';
import { useKeyControls } from 'hooks/video/key-control';
import { useEdit } from 'hooks/video/edit';
import './VideoPlayer.scss';

interface VideoPlayerProps {
  currentVideo: PlayerNode;
  active: boolean;
  autoPlay?: boolean;
  editMode?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentVideo,
  active,
  autoPlay = true,
  editMode = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDependencies = useMemo(
    () => ({
      videoRef,
      editMode,
      active,
      autoPlay,
      currentVideo,
    }),
    [editMode, active, autoPlay, currentVideo]
  );

  /**
   * HOOKS
   */

  const { player } = usePlayer(videoDependencies);

  const {
    displayControls,
    displayCursor,
    showControls,
    hideControls,
    hideControlsInSeconds,
  } = useControls(videoDependencies);

  const { playbackState, setPlaybackState, togglePlayback, startAutoPlay } =
    usePlayback(videoDependencies);

  const {
    volumeState,
    volumeChangeHandler,
    changeVolumeWithInput,
    changeVolumeWithKey,
    configureVolume,
    toggleMute,
  } = useVolume(videoDependencies);

  const { currentTimeUI, remainedTimeUI, updateTime } =
    useTime(videoDependencies);

  const {
    currentProgress,
    bufferProgress,
    videoDuration,
    progressTooltip,
    progressTooltipPosition,
    updateProgress,
    updateTooltip,
    changeProgressWithInput,
    changeProgressWithKey,
    configureDuration,
  } = useProgress(videoDependencies);

  const { fullscreenState, toggleFullscreen } = useFullscreen();

  const { displaySettings, setDisplaySettings, toggleSettings } = useSettings();

  const {
    playbackRates,
    activePlaybackRate,
    changePlaybackRate,
    configurePlaybackRate,
  } = usePlaybackRate(videoDependencies);

  const {
    resolutions,
    activeResolutionHeight,
    changeResolution,
    configureResolution,
  } = useResolution({ ...videoDependencies, player });

  const { displayLoader, showLoader, hideLoader } = useLoader();

  const {
    displaySelector,
    selectionStartPoint,
    selectionEndPoint,
    updateSelector,
    selectNextVideo,
    videoEndedHandler,
    navigateToNextVideo,
    navigateToPreviousVideo,
    navigateToFirstVideo,
  } = useSelector(videoDependencies);

  const { startHistoryUpdate, stopHistoryUpdate } =
    useHistory(videoDependencies);

  const { videoError, errorHandler } = useError(videoDependencies);

  const { selectionTimeMarked, markSelectionTime } = useEdit(videoDependencies);

  const keyControlsDependencies = useMemo(
    () => ({
      editMode,
      active,
      onPlayback: togglePlayback,
      onProgress: changeProgressWithKey,
      onVolume: changeVolumeWithKey,
      onSelect: selectNextVideo,
    }),
    [
      editMode,
      active,
      togglePlayback,
      changeProgressWithKey,
      changeVolumeWithKey,
      selectNextVideo,
    ]
  );

  const { displayKeyAction, videoKeyActionRef } = useKeyControls(
    keyControlsDependencies
  );

  /**
   * EVENT HANDLERS
   */

  const videoPlayHandler = useCallback(() => {
    hideControlsInSeconds();
    setPlaybackState(true);
    startHistoryUpdate();
  }, [hideControlsInSeconds, setPlaybackState, startHistoryUpdate]);

  const videoPauseHandler = useCallback(() => {
    showControls();
    setPlaybackState(false);
    stopHistoryUpdate();
  }, [showControls, setPlaybackState, stopHistoryUpdate]);

  const timeChangeHandler = useCallback(() => {
    updateTime();
    updateProgress();
    updateSelector();
  }, [updateTime, updateProgress, updateSelector]);

  const videoLoadedHandler = useCallback(() => {
    timeChangeHandler();
    configureVolume();
    configureDuration();
    configureResolution();
    configurePlaybackRate();
    startAutoPlay();
  }, [
    timeChangeHandler,
    configureVolume,
    configureDuration,
    configureResolution,
    configurePlaybackRate,
    startAutoPlay,
  ]);

  /**
   * RENDER
   */

  return (
    <div
      className="vp-container"
      style={{ cursor: displayCursor ? 'default' : 'none' }}
      onMouseMove={showControls}
      onMouseLeave={hideControls}
      onContextMenu={(e) =>
        process.env.NODE_ENV !== 'development' && e.preventDefault()
      }
    >
      {!editMode && (
        <VideoHeader hideOn={!displayControls || displaySelector} />
      )}
      <video
        ref={videoRef}
        onLoadedMetadata={videoLoadedHandler}
        onClick={togglePlayback}
        onPlay={videoPlayHandler}
        onPause={videoPauseHandler}
        onEnded={videoEndedHandler}
        onVolumeChange={volumeChangeHandler}
        onTimeUpdate={timeChangeHandler}
        onDoubleClick={toggleFullscreen}
        onSeeking={showLoader}
        onSeeked={hideLoader}
        onWaiting={showLoader}
        onCanPlay={hideLoader}
        onError={errorHandler}
      />
      <Loader on={displayLoader} />
      <KeyAction
        ref={videoKeyActionRef}
        on={displayKeyAction}
        volume={volumeState}
      />
      <Selector
        on={displaySelector}
        next={currentVideo.children}
        currentTime={currentProgress}
        selectionEndPoint={selectionEndPoint}
        onSelect={selectNextVideo}
      />
      <Error error={videoError} />
      <Controls hideOn={!displayControls || displaySelector}>
        <Dropdown
          on={displaySettings}
          resolutions={resolutions}
          playbackRates={playbackRates}
          activeResolutionHeight={activeResolutionHeight}
          activePlaybackRate={activePlaybackRate}
          onClose={setDisplaySettings}
          onChangeResolution={changeResolution}
          onChangePlaybackRate={changePlaybackRate}
        />
        <section>
          <Time time={currentTimeUI} />
          <Progress
            bufferProgress={bufferProgress}
            currentProgress={currentProgress}
            videoDuration={videoDuration}
            progressTooltip={progressTooltip}
            progressTooltipPosition={progressTooltipPosition}
            selectionStartPoint={selectionStartPoint}
            selectionEndPoint={selectionEndPoint}
            editMode={editMode}
            onHover={updateTooltip}
            onSeek={changeProgressWithInput}
          />
          <Time time={remainedTimeUI} />
        </section>
        <section>
          <div>
            <Volume
              volume={volumeState}
              onToggle={toggleMute}
              onSeek={changeVolumeWithInput}
            />
          </div>
          <div>
            <Rewind
              onRestart={navigateToFirstVideo}
              onPrev={navigateToPreviousVideo}
            />
            <Playback isPaused={playbackState} onToggle={togglePlayback} />
            <Skip onNext={navigateToNextVideo} />
          </div>
          <div>
            {editMode && (
              <Marker
                isMarked={selectionTimeMarked}
                onMark={markSelectionTime}
              />
            )}
            <Settings onToggle={toggleSettings} />
            <Records onToggle={() => {}} />
            <Fullscreen
              isFullscreen={fullscreenState}
              onToggle={toggleFullscreen}
            />
          </div>
        </section>
      </Controls>
    </div>
  );
};

export default VideoPlayer;
