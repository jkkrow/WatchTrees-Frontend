import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import VideoPlayer from '../../Player/VideoPlayer';
import { ReactComponent as AngleLeftIcon } from 'assets/icons/angle-left.svg';
import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import { VideoNode as VideoNodeType } from 'store/types/video';
import { videoActions } from 'store/slices/video-slice';
import { findAncestors } from 'util/tree';
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
  const { activeNodeId, videoTree } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isActive = useMemo(
    () => currentVideo._id === activeNodeId,
    [currentVideo._id, activeNodeId]
  );
  const isActiveChild = useMemo(
    () => currentVideo.parentId === activeNodeId,
    [currentVideo.parentId, activeNodeId]
  );
  const isAncestor = useMemo(() => {
    const ancestors = findAncestors(videoTree!, activeNodeId, true);
    const ids = ancestors.map((item) => item._id);

    return (id: string) => ids.includes(id);
  }, [videoTree, activeNodeId]);

  const returnHandler = () => {
    if (currentVideo.parentId) {
      dispatch(videoActions.setActiveNode(currentVideo.parentId));
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {(isActive || isActiveChild) && (
        <div className="video-node" data-active={isActive}>
          {currentVideo.info ? (
            <VideoPlayer
              id={currentVideo._id}
              parentId={currentVideo.parentId}
              layer={currentVideo.layer}
              info={currentVideo.info}
              children={currentVideo.children}
              autoPlay={autoPlay}
              editMode={editMode}
              active={activeNodeId === currentVideo._id}
            />
          ) : (
            <div className="video-node__not-found">
              <p>Not Found</p>
              <AngleLeftIcon className="btn" onClick={returnHandler} />
            </div>
          )}
        </div>
      )}

      {currentVideo.children.map(
        (video: VideoNodeType) =>
          (isActive || isAncestor(video._id)) && (
            <VideoNode
              key={video._id}
              currentVideo={video}
              autoPlay={autoPlay}
              editMode={editMode}
            />
          )
      )}
    </>
  );
};

export default VideoNode;
