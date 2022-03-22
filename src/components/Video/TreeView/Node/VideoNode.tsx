import { useNavigate } from 'react-router';

import VideoPlayer from '../../Player/VideoPlayer';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import {
  VideoNode as VideoNodeType,
  PlayerNode,
  videoActions,
} from 'store/slices/video-slice';
import './VideoNode.scss';

interface VideoNodeProps {
  currentVideo: VideoNodeType;
  autoPlay?: boolean;
  editMode?: boolean;
}

const VideoNode: React.FC<VideoNodeProps> = ({
  currentVideo,
  autoPlay = true,
  editMode = false,
}) => {
  const { activeNodeId } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const returnHandler = () => {
    if (currentVideo.layer !== 0) {
      dispatch(videoActions.setActiveNode(currentVideo.parentId!));
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {(currentVideo._id === activeNodeId ||
        currentVideo.parentId === activeNodeId) &&
        (currentVideo.info ? (
          <div
            className={`video-node${
              activeNodeId === currentVideo._id ? ' active' : ''
            }`}
          >
            <VideoPlayer
              currentVideo={currentVideo as PlayerNode}
              autoPlay={autoPlay}
              editMode={editMode}
              active={activeNodeId === currentVideo._id}
            />
          </div>
        ) : (
          <div
            className={`video-node__not-found${
              activeNodeId === currentVideo._id ? ' active' : ''
            }`}
            key={currentVideo._id}
          >
            <p>Not Found</p>
            <AngleLeftIcon className="btn" onClick={returnHandler} />
          </div>
        ))}

      {currentVideo.children.map((video: VideoNodeType) => (
        <VideoNode
          key={video._id}
          currentVideo={video}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      ))}
    </>
  );
};

export default VideoNode;
