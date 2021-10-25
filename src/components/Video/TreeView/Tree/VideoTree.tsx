import { useEffect, useState } from 'react';

import VideoNode from '../Node/VideoNode';
import { useAppDispatch, useVideoSelector } from 'hooks/store-hook';
import { VideoTree as VideoTreeType } from 'store/reducers/video';
import { setVideoTree, updateActiveVideo } from 'store/actions/video';
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
  const { videoTree, activeVideoId } = useVideoSelector();
  const dispatch = useAppDispatch();

  const [rootVideo] = useState(tree.root);

  useEffect(() => {
    dispatch(setVideoTree(tree));
  }, [dispatch, tree]);

  useEffect(() => {
    dispatch(updateActiveVideo(rootVideo.id));
  }, [dispatch, rootVideo]);

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
