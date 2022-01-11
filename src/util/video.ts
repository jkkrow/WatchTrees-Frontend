import { VideoListDetail, History } from 'store/slices/video-slice';

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

  if (skipFullyWatched) {
    localHistory = localHistory.filter((history) => !history.progress.isEnded);
  }

  const startIndex = (page - 1) * max;
  const endIndex = page * max;

  const slicedHistory = localHistory.slice(startIndex, endIndex);

  return { localHistory: slicedHistory.map((history) => history.video), count };
};

export const addToLocalHistory = (history: History) => {
  const historyStorage = localStorage.getItem('history');

  if (!historyStorage) {
    localStorage.setItem('history', JSON.stringify([history]));
  } else {
    const localHistory: History[] = JSON.parse(historyStorage);

    const existingHistory = localHistory.find(
      (item) => item.video === history.video
    );

    if (existingHistory) {
      existingHistory.progress = history.progress;
      existingHistory.updatedAt = history.updatedAt;
    } else {
      localHistory.push(history);
    }

    localStorage.setItem('history', JSON.stringify(localHistory));
  }
};

export const removeFromLocalHistory = (videoId: string) => {
  const historyStorage = localStorage.getItem('history');

  if (!historyStorage) return;

  const localHistory: History[] = JSON.parse(historyStorage);

  const filteredHistory = localHistory.filter(
    (history) => history.video !== videoId
  );

  localStorage.setItem('history', JSON.stringify(filteredHistory));
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

export const sortByHistory = (videos: VideoListDetail[]) => {
  videos.sort((a, b) => {
    if (!a.history || !b.history) return 0;

    const dateA = new Date(a.history.updatedAt);
    const dateB = new Date(b.history.updatedAt);

    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return +1;
    }
    return 0;
  });
};
