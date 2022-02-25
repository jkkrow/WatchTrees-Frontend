import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import VideoTree from 'components/Video/TreeView/Tree/VideoTree';
import VideoDetail from 'components/Video/UI/Detail/VideoDetail';
import Loader from 'components/Video/Player/UI/Loader/Loader';
import { useAppThunk } from 'hooks/store-hook';
import { VideoTreeClient } from 'store/slices/video-slice';
import { fetchVideo } from 'store/thunks/video-thunk';
import 'styles/video.scss';

const VideoPage: React.FC = () => {
  const { dispatchThunk, data, loaded } = useAppThunk<VideoTreeClient | null>(
    null
  );

  const { id } = useParams();

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';

    return () => {
      document.documentElement.style.overflowY = 'scroll';
    };
  }, []);

  useEffect(() => {
    dispatchThunk(fetchVideo(id!));
  }, [dispatchThunk, id]);

  return (
    <div className="video-page">
      <div>
        <Loader on={!loaded} />
        {data && <VideoTree tree={data} history={data.history} />}
      </div>
      {data && <VideoDetail video={data} />}
    </div>
  );
};

export default VideoPage;
