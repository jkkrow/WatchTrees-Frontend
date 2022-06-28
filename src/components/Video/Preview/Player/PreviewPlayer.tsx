import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from 'components/Video/Player/UI/Loader/Loader';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as VolumeHighIcon } from 'assets/icons/volume-high.svg';
import { ReactComponent as VolumeMuteIcon } from 'assets/icons/volume-mute.svg';
import { usePlayer } from 'hooks/video/player';
import { useVolume } from 'hooks/video/volume';
import { useLoader } from 'hooks/video/loader';
import { useLocalStorage } from 'hooks/common/storage';
import { NodeInfo, VideoNode } from 'store/slices/video-slice';
import './PreviewPlayer.scss';

interface PreviewPlayerProps {
  treeId: string;
  id: string;
  info: NodeInfo;
  children: VideoNode[];
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ treeId, ...rest }) => {
  const navigate = useNavigate();

  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useLocalStorage('preview-mute', false);

  const videoPlayerDependencies = usePlayer({ ...rest });
  const { toggleMute, configureVolume } = useVolume(videoPlayerDependencies);
  const { displayLoader, showLoader, hideLoader } = useLoader();

  const previewEndedHandler = useCallback(() => {
    setIsEnded(true);
  }, []);

  const toggleMuteHandler = useCallback(() => {
    toggleMute();
    setIsMuted(!isMuted);
  }, [isMuted, toggleMute, setIsMuted]);

  const videoLoadHandler = useCallback(() => {
    configureVolume();
    isMuted && (videoPlayerDependencies.videoRef.current!.volume = 0);
  }, [configureVolume, videoPlayerDependencies.videoRef, isMuted]);

  const navigateToVideoHandler = useCallback(() => {
    navigate(`/video/${treeId}`);
  }, [navigate, treeId]);

  return (
    <div className="preview-player">
      <div className="preview-player__loader" onClick={navigateToVideoHandler}>
        <Loader on={displayLoader} style={{ fontSize: '3rem' }} />
      </div>
      <video
        ref={videoPlayerDependencies.videoRef}
        autoPlay={true}
        onClick={navigateToVideoHandler}
        onLoadedMetadata={videoLoadHandler}
        onEnded={previewEndedHandler}
        onWaiting={showLoader}
        onCanPlay={hideLoader}
      />
      <div
        className={`preview-player__playback${isEnded ? ' active' : ''}`}
        onClick={navigateToVideoHandler}
      >
        <PlayIcon />
      </div>
      <div
        className={`preview-player__volume${
          !displayLoader && !isEnded ? ' active' : ''
        }`}
        onClick={toggleMuteHandler}
      >
        {isMuted ? <VolumeMuteIcon /> : <VolumeHighIcon />}
      </div>
    </div>
  );
};

export default PreviewPlayer;
