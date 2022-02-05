import { useEffect } from 'react';

import VideoNode from '../Node/VideoNode';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import {
  VideoTree as VideoTreeType,
  videoActions,
  History,
} from 'store/slices/video-slice';

import './VideoTree.scss';

interface VideoTreeProps {
  tree: VideoTreeType;
  history?: History | null;
  autoPlay?: boolean;
  editMode?: boolean;
}

const VideoTree: React.FC<VideoTreeProps> = ({
  tree,
  history,
  autoPlay = true,
  editMode = false,
}) => {
  const { activeVideoId, initialProgress } = useAppSelector(
    (state) => state.video
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    let initialNodeId = tree.root.id;
    let initialTime = 0;

    if (history && !history.progress.isEnded) {
      initialNodeId = history.progress.activeVideoId;
      initialTime = history.progress.time;
    }
    dispatch(videoActions.setActiveVideo(initialNodeId));
    dispatch(videoActions.setInitialProgress(initialTime));

    return () => {
      dispatch(videoActions.setInitialProgress(null));
    };
  }, [dispatch, tree.root.id, history]);

  return (
    <div className="video-tree">
      {activeVideoId && initialProgress !== null && (
        <VideoNode
          currentVideo={tree.root}
          videoId={tree._id}
          rootId={tree.root.id}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default VideoTree;
