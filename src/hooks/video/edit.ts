import { useCallback, useState } from 'react';

import { useAppDispatch } from 'hooks/store-hook';
import { PlayerNode } from 'store/slices/video-slice';
import { uploadActions } from 'store/slices/upload-slice';

interface Dependencies {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentVideo: PlayerNode;
  editMode: boolean;
}

export const useEdit = ({ videoRef, currentVideo, editMode }: Dependencies) => {
  const dispatch = useAppDispatch();

  const [selectionTimeMarked, setSelectionTimeMarked] = useState(false);

  const markSelectionTime = useCallback(() => {
    if (!editMode) return;

    const video = videoRef.current!;
    const duration = video.duration;
    const { selectionTimeStart, selectionTimeEnd } = currentVideo.info;

    if (!selectionTimeMarked) {
      // Mark start point
      dispatch(
        uploadActions.setNode({
          info: {
            selectionTimeStart: +video.currentTime.toFixed(3),
          },
          nodeId: currentVideo._id,
        })
      );

      if (video.currentTime > (selectionTimeEnd || 0)) {
        dispatch(
          uploadActions.setNode({
            info: {
              selectionTimeEnd:
                video.currentTime + 10 > duration
                  ? +duration.toFixed(3)
                  : +(video.currentTime + 10).toFixed(3),
            },
            nodeId: currentVideo._id,
          })
        );
      }
    } else {
      // Mark end point
      dispatch(
        uploadActions.setNode({
          info: {
            selectionTimeEnd: +video.currentTime.toFixed(3),
          },
          nodeId: currentVideo._id,
        })
      );

      if (video.currentTime < (selectionTimeStart || 0)) {
        dispatch(
          uploadActions.setNode({
            info: {
              selectionTimeStart:
                video.currentTime - 10 < 0
                  ? 0
                  : +(video.currentTime - 10).toFixed(3),
            },
            nodeId: currentVideo._id,
          })
        );
      }
    }

    setSelectionTimeMarked((prev) => !prev);
  }, [
    videoRef,
    editMode,
    currentVideo._id,
    currentVideo.info,
    selectionTimeMarked,
    dispatch,
  ]);

  return { selectionTimeMarked, markSelectionTime };
};
