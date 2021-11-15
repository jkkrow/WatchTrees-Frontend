import { VideoTree } from 'store/slices/video-slice';
import { formatTime } from './format';

export const videoUrl = (src: string, isConverted: boolean): string => {
  return isConverted
    ? `${process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED}/${src}`
    : `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${src}`;
};

export const thumbanilUrl = (video: VideoTree): string | undefined => {
  let src: string | undefined;

  if (video.root.info?.isConverted) {
    src = `${
      process.env.REACT_APP_RESOURCE_DOMAIN_CONVERTED
    }/${video.root.info.url.replace(/\.\w+$/, '.0000001.jpg')}`;
  }

  if (video.thumbnail.url) {
    src = `${process.env.REACT_APP_RESOURCE_DOMAIN_SOURCE}/${video.thumbnail.url}`;
  }

  return src;
};

export const videoDuration = (video: VideoTree): string => {
  let duration: string;

  const minDuration = formatTime(video.minDuration);
  const maxDuration = formatTime(video.maxDuration);

  if (minDuration === maxDuration) {
    duration = maxDuration;
  } else {
    duration = `${minDuration} - ${maxDuration}`;
  }

  return duration;
};
