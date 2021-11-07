import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { RootState, AppDispatch } from 'store';
import { uploadActions } from 'store/reducers/upload-reducer';
import { uiActions } from 'store/reducers/ui-reducer';
import { VideoTree, VideoInfo } from 'types/video';
import { beforeunloadHandler } from 'util/event-handlers';

export const initiateUpload = () => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.initiateUpload());

    window.addEventListener('beforeunload', beforeunloadHandler);
  };
};

export const uploadVideo = (file: File, nodeId: string, treeId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const videoDuration = await new Promise<number>((resolve) => {
        const video = document.createElement('video');

        video.onloadedmetadata = () => resolve(video.duration);
        video.src = URL.createObjectURL(file);
      });

      const nodeInfo = {
        name: file.name,
        size: file.size,
        duration: videoDuration,
        label: 'Default',
        timelineStart: null,
        timelineEnd: null,
        progress: 0,
        error: null,
        isConverted: false,
        url: '',
      };

      dispatch(
        uploadActions.setNode({ type: 'uploadTree', info: nodeInfo, nodeId })
      );
      dispatch(
        uploadActions.setNode({
          type: 'previewTree',
          info: { ...nodeInfo, url: URL.createObjectURL(file) },
          nodeId,
        })
      );

      // Initiate Upload
      let accessToken = getState().auth.accessToken as string;
      const response = await axios.get('/upload/video-initiate', {
        params: {
          treeId,
          fileName: file.name,
          fileType: file.type,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { uploadId } = response.data;

      const fileSize = file.size;
      const CHUNK_SIZE = 10000000; // 10MB
      const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
      const promisesArray = [];
      const progressArray: number[] = [];
      const uploadPartsArray: { ETag: string; PartNumber: number }[] = [];

      let start, end, blob;

      const uploadProgressHandler = async (
        progressEvent: ProgressEvent,
        index: number
      ) => {
        if (progressEvent.loaded >= progressEvent.total) return;

        const currentProgress =
          Math.round(progressEvent.loaded * 100) / progressEvent.total;

        progressArray[index - 1] = currentProgress;
        const sum = progressArray.reduce((acc, cur) => acc + cur);

        dispatch(
          uploadActions.setNode({
            info: { progress: Math.round(sum / CHUNKS_COUNT) },
            nodeId,
          })
        );
      };

      for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
        start = (index - 1) * CHUNK_SIZE;
        end = index * CHUNK_SIZE;
        blob =
          index < CHUNKS_COUNT ? file.slice(start, end) : file.slice(start);

        // Get Urls
        accessToken = getState().auth.accessToken as string;
        const getUploadUrlResponse = await axios.get('/upload/video-url', {
          params: {
            uploadId,
            partNumber: index,
            treeId,
            fileName: file.name,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { presignedUrl } = getUploadUrlResponse.data;

        // Save Promises
        const request = axios.create();
        axiosRetry(request, { retries: 3, retryDelay: () => 3000 });

        const uploadPromise = request.put(presignedUrl, blob, {
          onUploadProgress: (e) => uploadProgressHandler(e, index),
          headers: {
            'Content-Type': file.type,
          },
        });
        promisesArray.push(uploadPromise);
      }

      // Upload Parts
      const resolvedArray = await Promise.all(promisesArray);

      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag,
          PartNumber: index + 1,
        });
      });

      // Complete Upload
      accessToken = getState().auth.accessToken as string;
      const completeUploadReseponse = await axios.post(
        '/upload/video-complete',
        {
          params: {
            uploadId,
            parts: uploadPartsArray,
            treeId,
            fileName: file.name,
          },
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      dispatch(uploadActions.setNode({ info: { progress: 100 }, nodeId }));

      const { url } = completeUploadReseponse.data;

      dispatch(
        uploadActions.setNode({ type: 'uploadTree', info: { url }, nodeId })
      );

      dispatch(saveUpload());
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        uploadActions.setNode({
          info: { error: error.response?.data?.message || error.message },
          nodeId,
        })
      );
    }
  };
};

export const uploadThumbnail = (file: File) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const thumbnailInfo = {
        name: file.name,
        url: URL.createObjectURL(file),
      };

      dispatch(uploadActions.setTree({ info: { thumbnail: thumbnailInfo } }));

      const { auth } = getState();
      const accessToken = auth.accessToken as string;

      const response = await axios.get('/upload/image', {
        params: { fileType: file.type },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { presignedUrl, key } = response.data;

      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
      });

      dispatch(
        uploadActions.setTree({
          type: 'uploadTree',
          info: { thumbnail: { name: file.name, url: key } },
        })
      );

      dispatch(saveUpload());
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        uiActions.setMessage({
          content: `${
            error.response?.data?.message || error.message
          } - Uploading thumbnail failed.`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const saveUpload = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get current upload state
      const { auth, upload } = getState();

      const uploadTree = upload.uploadTree as VideoTree;
      const accessToken = auth.accessToken as string;

      const saveRepsonse = await axios.post(
        '/upload/save-upload',
        { uploadTree },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      dispatch(uploadActions.saveUpload());

      dispatch(
        uiActions.setMessage({
          content: saveRepsonse.data.message,
          type: 'message',
          timer: 3000,
        })
      );
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        uiActions.setMessage({
          content: `${
            error.response?.data?.message || error.message
          } - Saving upload failed.`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const appendNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.appendNode({ nodeId }));
  };
};

export const updateNode = (
  info: { [key in keyof VideoInfo]?: VideoInfo[key] } | null,
  nodeId: string
) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setNode({ info, nodeId }));
  };
};

export const removeNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.removeNode({ nodeId }));
  };
};

export const updateTree = (info: {
  [key in keyof VideoTree]?: VideoTree[key];
}) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setTree({ info }));
  };
};

export const updateActiveNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setActiveNode(nodeId));
  };
};

export const finishUpload = () => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.finishUpload());

    window.removeEventListener('beforeunload', beforeunloadHandler);
  };
};
