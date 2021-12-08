import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import VideoLayout from 'components/Video/Layout/VideoLayout';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoItemDetail } from 'store/slices/video-slice';
import { fetchVideo } from 'store/thunks/video-thunk';

const VideoPage: React.FC = () => {
  const [video, setVideo] = useState<VideoItemDetail | null>(null);

  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      const video = await dispatch(fetchVideo(id));

      setVideo(video);
    })();
  }, [dispatch, id]);

  return video && <VideoLayout video={video} />;
};

export default VideoPage;
