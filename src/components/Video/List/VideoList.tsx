import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import VideoItem from '../Item/VideoItem';
import VideoLoader from 'components/Common/UI/Loader/Video/VIdeoLoader';
import Pagination from 'components/Common/UI/Pagination/Pagination';
import { usePaginate } from 'hooks/page-hook';
import { useSearch } from 'hooks/search-hook';
import { VideoListDetail } from 'store/slices/video-slice';
import './VideoList.scss';

interface VideoListProps {
  onFetch: (
    params: any,
    forceUpdate: boolean
  ) => Promise<{ videos: VideoListDetail[]; count: number }>;
}

const VideoList: React.FC<VideoListProps> = ({ onFetch }) => {
  const [videos, setVideos] = useState<VideoListDetail[]>([]);
  const [count, setCount] = useState(0);
  const [loaders, setLoaders] = useState<undefined[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { currentPage, itemsPerPage } = usePaginate(20);
  const { keyword } = useSearch();

  const listRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const listWidth = listRef.current!.offsetWidth;
      const rows = Math.floor(listWidth / 300);

      setLoaders(Array.from(Array(rows * 3)));

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

      setLoaders([]);
      setLoaded(true);
    })();
  }, [history, currentPage, itemsPerPage, keyword, onFetch]);

  return (
    <>
      <div className="video-list" ref={listRef}>
        {loaders.map((_, index) => (
          <div key={index}>
            <VideoLoader on={!!loaders.length} detail />
          </div>
        ))}
        {loaded &&
          videos.map((item) => <VideoItem key={item._id} video={item} />)}
      </div>
      {loaded && !videos.length && (
        <div className="video-list__empty">No video found</div>
      )}
      <Pagination
        count={count}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        keyword={keyword}
      />
    </>
  );
};

export default VideoList;
