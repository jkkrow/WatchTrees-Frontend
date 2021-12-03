import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import VideoItem from '../Item/VideoItem';
import VideoLoader from 'components/Common/UI/Loader/Video/VIdeoLoader';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoTreeWithCreatorInfo } from 'store/slices/video-slice';
import { fetchVideos } from 'store/thunks/video-thunk';
import './VideoList.scss';

interface VideoListProps {
  params?: {
    max?: number;
    userId?: string;
  };
}

const VideoList: React.FC<VideoListProps> = ({ params }) => {
  const dispatch = useAppDispatch();

  const [loaders, setLoaders] = useState<undefined[]>([]);
  const [videos, setVideos] = useState<VideoTreeWithCreatorInfo[]>([]);
  const [count, setCount] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);

  const { currentPage, itemsPerPage } = usePaginate(params?.max || 20);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const listWidth = listRef.current!.offsetWidth;
      const rows = Math.floor(listWidth / 300);

      setLoaders(Array.from(Array(rows * 3)));

      const data = await dispatch(
        fetchVideos(
          { page: currentPage, max: itemsPerPage, ...params },
          history.action !== 'POP'
        )
      );

      if (data) {
        setVideos(data.videos);
        setCount(data.count);
        setLoaders([]);
      }
    })();
  }, [dispatch, history, currentPage, itemsPerPage, params]);

  return (
    <>
      <div className="video-list" ref={listRef}>
        {loaders.map((item, index) => (
          <div key={index}>
            <VideoLoader on={!!loaders.length} detail />
          </div>
        ))}
        {!loaders.length &&
          videos.map((item) => <VideoItem key={item._id} video={item} />)}
      </div>
      <Pagination
        count={count}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
};

export default VideoList;
