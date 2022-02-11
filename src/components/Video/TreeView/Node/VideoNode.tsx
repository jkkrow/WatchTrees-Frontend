import { useNavigate } from 'react-router';

import VideoPlayer from '../../Player/VideoPlayer';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import {
  VideoNode as VideoNodeType,
  videoActions,
} from 'store/slices/video-slice';
import './VideoNode.scss';

interface VideoNodeProps {
  currentVideo: VideoNodeType;
  videoId: string;
  rootId: string;
  autoPlay?: boolean;
  editMode?: boolean;
}

const VideoNode: React.FC<VideoNodeProps> = ({
  currentVideo,
  videoId,
  rootId,
  autoPlay = true,
  editMode = false,
}) => {
  const { activeVideoId } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const returnHandler = () => {
    if (currentVideo.layer !== 0) {
      dispatch(videoActions.setActiveVideo(currentVideo.prevId!));
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {(currentVideo.id === activeVideoId ||
        currentVideo.prevId === activeVideoId) &&
        (currentVideo.info ? (
          <div
            className={`video-node${
              activeVideoId === currentVideo.id ? ' active' : ''
            }`}
          >
            <VideoPlayer
              currentVideo={currentVideo}
              videoId={videoId}
              rootId={rootId}
              autoPlay={autoPlay}
              editMode={editMode}
              active={activeVideoId === currentVideo.id}
            />
          </div>
        ) : (
          <div
            className={`video-node__not-found${
              activeVideoId === currentVideo.id ? ' active' : ''
            }`}
            key={currentVideo.id}
          >
            <p>Not Found</p>
            <AngleLeftIcon className="btn" onClick={returnHandler} />
          </div>
        ))}

      {currentVideo.children.map((video: VideoNodeType) => (
        <VideoNode
          key={video.id}
          currentVideo={video}
          videoId={videoId}
          rootId={rootId}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      ))}
    </>
  );
};

export default VideoNode;
