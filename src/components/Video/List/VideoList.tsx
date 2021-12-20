import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import VideoItem from '../Item/VideoItem';
import VideoLoaderList from '../Loader/List/VideoLoaderList';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoList.scss';

interface VideoListProps {
  label?: string;
  onFetch: (
    params: any,
    forceUpdate: boolean
  ) => Promise<{ videos: VideoListDetail[]; count: number }>;
}

const VideoList: React.FC<VideoListProps> = ({ label, onFetch }) => {
  const [videos, setVideos] = useState<VideoListDetail[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { currentPage, itemsPerPage } = usePaginate(20);
  const { keyword } = useSearch();

  const history = useHistory();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await onFetch(
        {
          page: currentPage,
          max: itemsPerPage,
          search: keyword,
        },
        history.action !== 'POP'
      );

      if (data) {
        setVideos(data.videos);
        setCount(data.count);
      }

      setLoading(false);
    })();
  }, [history, currentPage, itemsPerPage, keyword, onFetch]);

  return (
    <div className="video-list__container">
      <VideoLoaderList loading={loading} rows={3} />
      {!loading && videos.length > 0 && label && (
        <h3 className="video-list__label">{label}</h3>
      )}
      <div className="video-list">
        {!loading &&
          videos.length > 0 &&
          videos.map((item) => <VideoItem key={item._id} video={item} />)}
      </div>
      {!loading && !videos.length && (
        <div className="video-list__empty">No video found</div>
      )}
      <Pagination
        count={count}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        keyword={keyword}
      />
    </div>
  );
};

export default VideoList;
