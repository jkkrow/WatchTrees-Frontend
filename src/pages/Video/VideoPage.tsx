import { useEffect } from 'react';
import { useParams } from 'react-router';

import Loader from 'components/Video/Player/UI/Loader/Loader';
import VideoLayout from 'components/Video/Layout/VideoLayout';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoItemDetail } from 'store/slices/video-slice';
import { fetchVideo } from 'store/thunks/video-thunk';

const VideoPage: React.FC = () => {
  const { dispatchThunk, data, loaded } =
    useAppDispatch<VideoItemDetail | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatchThunk(fetchVideo(id));
  }, [dispatchThunk, id]);

  return (
    <>
      <Loader on={!loaded} />
      {data && <VideoLayout video={data} />}
    </>
  );
};

export default VideoPage;
