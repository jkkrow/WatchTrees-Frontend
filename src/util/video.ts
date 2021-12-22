import { VideoTree, VideoListDetail, History } from 'store/slices/video-slice';

export const videoUrl = (src: string, isConverted: boolean) => {
  return isConverted
    ? `${process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED}/${src}`
    : `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${src}`;
};

export const thumbanilUrl = (video: VideoTree) => {
  let src: string | undefined;

  if (video.root.info?.isConverted) {
    src = `${
      process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED
    }/${video.root.info.url.replace(/\.\w+$/, '.0000001.jpg')}`;
  }

  if (video.info.thumbnail.url) {
    src = `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${video.info.thumbnail.url}`;
  }

  return src;
};

export const getLocalHistory = (params: {
  page: number;
  max: number;
  skipFullyWatched: boolean;
}) => {
  const historyStorage = localStorage.getItem('history');
  if (!historyStorage) return;

  let localHistory: History[] = JSON.parse(historyStorage);
  if (!localHistory.length) return;

  let { page, max, skipFullyWatched } = params;

  page = page || 1;
  max = max || 10;

  const count = localHistory.length;

  if (skipFullyWatched) {
    localHistory = localHistory.filter((history) => !history.progress.isEnded);
  }

  localHistory.sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);

    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return +1;
    }
    return 0;
  });

  const startIndex = (page - 1) * max;
  const endIndex = page * max;

  const slicedHistory = localHistory.slice(startIndex, endIndex);

  return { localHistory: slicedHistory.map((history) => history.video), count };
};

export const attachLocalHistory = (
  videos: VideoListDetail | VideoListDetail[]
) => {
  const historyStorage = localStorage.getItem('history');
  if (!historyStorage) return;

  const localHistory: History[] = JSON.parse(historyStorage);
  if (!localHistory.length) return;

  if (videos instanceof Array) {
    localHistory.forEach((historyItem) => {
      videos.forEach((video) => {
        if (video._id === historyItem.video) {
          video.history = historyItem;
        }
      });
    });
  } else {
    localHistory.forEach((historyItem) => {
      if (videos._id === historyItem.video) {
        videos.history = historyItem;
      }
    });
  }
};
