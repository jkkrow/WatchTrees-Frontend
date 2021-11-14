import { useEffect } from 'react';

import VideoNode from '../Node/VideoNode';
import { useAppDispatch, useAppSelector } from 'hooks/store-hook';
import {
  VideoTree as VideoTreeType,
  videoActions,
} from 'store/reducers/video-reducer';

import './VideoTree.scss';

interface VideoTreeProps {
  tree: VideoTreeType;
  autoPlay?: boolean;
  editMode?: boolean;
}

const VideoTree: React.FC<VideoTreeProps> = ({
  tree,
  autoPlay = true,
  editMode = false,
}) => {
  const { videoTree, activeVideoId } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(videoActions.setVideoTree(tree));
  }, [dispatch, tree]);

  useEffect(() => {
    dispatch(videoActions.setActiveVideo(tree.root.id));
  }, [dispatch, tree.root.id]);

  return (
    <div className="video-tree">
      {videoTree && activeVideoId && (
        <VideoNode
          currentVideo={videoTree.root}
          treeId={videoTree.root.id}
          activeVideoId={activeVideoId}
          autoPlay={autoPlay}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default VideoTree;
