import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import VideoItem from '../Item/VideoItem';
import LoadingCard from 'components/Common/UI/Loader/Card/LoadingCard';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useAppDispatch } from 'hooks/store-hook';
import { VideoTreeWithCreatorInfo } from 'store/slices/video-slice';
import { fetchVideos } from 'store/thunks/video-thunk';
import './VideoList.scss';

const VideoList: React.FC = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [loaders, setLoaders] = useState([undefined]);
  const [videos, setVideos] = useState<VideoTreeWithCreatorInfo[]>([]);
  const [count, setCount] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const { currentPage, itemsPerPage } = usePaginate(20);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const listWidth = listRef.current!.offsetWidth;
      const itemWidth = itemRef.current!.offsetWidth;

      let rows = Math.floor(listWidth / itemWidth);

      setLoaders(Array.from(Array(rows * 3)));

      const data = await dispatch(
        fetchVideos(
          { page: currentPage, max: itemsPerPage },
          history.action !== 'POP'
        )
      );

      if (data) {
        setVideos(data.videos);
        setCount(data.count);
        setLoading(false);
      }
    })();
  }, [dispatch, history, currentPage, itemsPerPage]);

  return (
    <>
      <div className="video-list" ref={listRef}>
        {loaders.map((item, index) => (
          <div key={index} className="video-item" ref={itemRef}>
            <LoadingCard on={loading} detail />
          </div>
        ))}
        {!loading &&
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
