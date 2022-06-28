import { useEffect } from 'react';

import VideoNode from '../Node/VideoNode';
import { useAppDispatch, useAppSelector } from 'hooks/common/store';
import {
  VideoTree as VideoTreeType,
  videoActions,
  History,
} from 'store/slices/video-slice';
import { addToHistory } from 'store/thunks/video-thunk';
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
  const { videoTree, activeNodeId } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(videoActions.setVideoTree(tree));
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
  }, [dispatch, tree.root._id, history]);

  useEffect(() => {
    activeNodeId && !editMode && dispatch(addToHistory());
  }, [dispatch, editMode, activeNodeId]);

  useEffect(() => {
    return () => {
      !editMode && dispatch(addToHistory(true));
      dispatch(videoActions.setVideoTree(null));
      dispatch(videoActions.setActiveNode(''));
      dispatch(videoActions.setInitialProgress(0));
      dispatch(videoActions.setCurrentProgress(0));
    };
  }, [dispatch, editMode]);

  return (
    <div className="video-tree">
      {videoTree && activeNodeId && (
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
