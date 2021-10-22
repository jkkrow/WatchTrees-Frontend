import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import VideoNode from "../Node/VideoNode";
import { setVideoTree, updateActiveVideo } from "store/actions/video";
import "./VideoTree.scss";

const VideoTree = ({ tree, autoPlay = true, editMode = false }) => {
  const dispatch = useDispatch();

  const { videoTree, activeVideoId } = useSelector((state) => state.video);

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
          autoPlay={autoPlay}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default VideoTree;
