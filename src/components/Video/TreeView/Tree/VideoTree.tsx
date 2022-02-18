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
  const { videoTree, activeNodeId, initialProgress } = useAppSelector(
    (state) => state.video
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(videoActions.setVideoTree(tree));

    return () => {
      dispatch(videoActions.setVideoTree(null));
    };
  }, [dispatch, tree]);

  useEffect(() => {
    let initialNodeId = tree.root._id;
    let initialTime = 0;

    if (history && !history.isEnded) {
      initialNodeId = history.activeNodeId;
      initialTime = history.progress;
    }

    dispatch(videoActions.setActiveNode(initialNodeId));
    dispatch(videoActions.setInitialProgress(initialTime));

    return () => {
      dispatch(videoActions.setActiveNode(''));
      dispatch(videoActions.setInitialProgress(null));
    };
  }, [dispatch, tree.root._id, history]);

  return (
    <div className="video-tree">
      {videoTree && activeNodeId && initialProgress !== null && (
        <VideoNode
          currentVideo={tree.root}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default VideoTree;
