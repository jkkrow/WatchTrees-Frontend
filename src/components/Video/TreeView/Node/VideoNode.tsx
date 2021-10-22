import { useDispatch, useSelector } from "react-redux";

import VideoPlayer from "../../Player/VideoPlayer";
import { ReactComponent as AngleLeftIcon } from "assets/icons/angle-left.svg";
import { updateActiveVideo } from "store/actions/video";
import "./VideoNode.scss";

const VideoNode = ({ currentVideo, autoPlay, editMode }) => {
  const dispatch = useDispatch();

  const { activeVideoId } = useSelector((state) => state.video);

  return (
    <>
      {(currentVideo.id === activeVideoId ||
        currentVideo.prevId === activeVideoId) &&
        (currentVideo.info ? (
          <div
            className={`video-node${
              activeVideoId === currentVideo.id ? " active" : ""
            }`}
          >
            <VideoPlayer
              currentVideo={currentVideo}
              autoPlay={autoPlay}
              editMode={editMode}
              active={activeVideoId === currentVideo.id}
            />
          </div>
        ) : (
          <div
            className={`video-node__not-found${
              activeVideoId === currentVideo.id ? " active" : ""
            }`}
            key={currentVideo.id}
          >
            <p>Not Found</p>
            <AngleLeftIcon
              onClick={() => dispatch(updateActiveVideo(currentVideo.prevId))}
            />
          </div>
        ))}

      {currentVideo.children.map((video) => (
        <VideoNode
          key={video.id}
          currentVideo={video}
          autoPlay={false}
          editMode={editMode}
        />
      ))}
    </>
  );
};

export default VideoNode;
