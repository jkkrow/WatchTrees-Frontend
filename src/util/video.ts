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
