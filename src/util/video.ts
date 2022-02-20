import { VideoTreeClient, History } from 'store/slices/video-slice';

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
    localHistory = localHistory.filter((history) => !history.isEnded);
  }

  const startIndex = (page - 1) * max;
  const endIndex = page * max;

  const slicedHistory = localHistory.slice(startIndex, endIndex);

  return { localHistory: slicedHistory.map((history) => history.tree), count };
};

export const addToLocalHistory = (history: History) => {
  const historyStorage = localStorage.getItem('history');

  if (!historyStorage) {
    localStorage.setItem('history', JSON.stringify([history]));
  } else {
    const localHistory: History[] = JSON.parse(historyStorage);

    const existingHistory = localHistory.find(
      (item) => item.tree === history.tree
    );

    if (existingHistory) {
      existingHistory.activeNodeId = history.activeNodeId;
      existingHistory.progress = history.progress;
      existingHistory.totalProgress = history.totalProgress;
      existingHistory.isEnded = history.isEnded;
      existingHistory.updatedAt = history.updatedAt;
    } else {
      localHistory.push(history);
    }

    localStorage.setItem('history', JSON.stringify(localHistory));
  }
};

export const removeFromLocalHistory = (treeId: string) => {
  const historyStorage = localStorage.getItem('history');

  if (!historyStorage) return;

  const localHistory: History[] = JSON.parse(historyStorage);

  const filteredHistory = localHistory.filter(
    (history) => history.tree !== treeId
  );

  localStorage.setItem('history', JSON.stringify(filteredHistory));
};

export const attachLocalHistory = (
  videos: VideoTreeClient | VideoTreeClient[],
  sort?: boolean
) => {
  const historyStorage = localStorage.getItem('history');
  if (!historyStorage) return videos;

  const localHistory: History[] = JSON.parse(historyStorage);
  if (!localHistory.length) return videos;

  if (videos instanceof Array) {
    const videosWithHistory = videos.map((video) => {
      const matchingHistory =
        localHistory.find((historyItem) => video._id === historyItem.tree) ||
        null;

      return { ...video, history: matchingHistory } as VideoTreeClient;
    });

    return sort ? sortByHistory(videosWithHistory) : videosWithHistory;
  } else {
    const video = videos;
    const matchingHistory = localHistory.find(
      (historyItem) => video._id === historyItem.tree
    );

    return { ...video, history: matchingHistory };
  }
};

export const sortByHistory = (videos: VideoTreeClient[]) => {
  return videos.sort((a, b) => {
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
