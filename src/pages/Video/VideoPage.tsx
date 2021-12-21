import { useEffect } from 'react';
import { useParams } from 'react-router';

import VideoLayout from 'components/Video/Layout/VideoLayout';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoItemDetail } from 'store/slices/video-slice';
import { fetchVideo } from 'store/thunks/video-thunk';

const VideoPage: React.FC = () => {
  const { dispatchThunk, data } = useAppDispatch<VideoItemDetail | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatchThunk(fetchVideo(id));
  }, [dispatchThunk, id]);

  return data && <VideoLayout video={data} />;
};

export default VideoPage;
