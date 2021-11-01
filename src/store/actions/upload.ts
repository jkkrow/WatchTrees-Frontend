import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { RootState, AppDispatch } from 'store';
import { uploadActions } from 'store/reducers/upload';
import { uiActions } from 'store/reducers/ui';
import { VideoTree } from 'store/reducers/video';
import { beforeunloadHandler } from 'util/event-handlers';

export const initiateUpload = () => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.initiateUpload());

    window.addEventListener('beforeunload', beforeunloadHandler);
  };
};

export const appendChild = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.appendNode({ nodeId }));
  };
};

export const attachVideo = (file: File, nodeId: string, treeId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const videoDuration = await new Promise((resolve) => {
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
      };

      dispatch(
        uploadActions.setNode({
          type: 'uploadTree',
          info: nodeInfo,
          nodeId,
        })
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
      const response = await axios.get('/upload/initiate-upload', {
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
            info: {
              progress: Math.round(sum / CHUNKS_COUNT),
            },
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
        const getUploadUrlResponse = await axios.get('/upload/get-upload-url', {
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
        axiosRetry(request, {
          retries: 3,
          retryDelay: () => 3000,
        });

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
        '/upload/complete-upload',
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

      dispatch(
        uploadActions.setNode({
          info: { progress: 100 },
          nodeId,
        })
      );

      const { url } = completeUploadReseponse.data;

      dispatch(
        uploadActions.setNode({
          type: 'uploadTree',
          info: { url },
          nodeId,
        })
      );
    } catch (err) {
      let error = err as AxiosError;
      dispatch(
        uploadActions.setNode({
          info: { error: error.response?.data?.message || error.message },
          nodeId,
        })
      );
    }

    dispatch(saveUpload());
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
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      dispatch(
        uiActions.setMessage({
          content: saveRepsonse.data.message,
          type: 'message',
          timer: 5000,
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

export const updateNode = (info: any, nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(
      uploadActions.setNode({
        info,
        nodeId,
      })
    );
  };
};

export const removeNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.removeNode({ nodeId }));
  };
};

export const updateTree = (info: any) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setTree({ info }));
  };
};

export const removeTree = () => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.removeTree());

    window.removeEventListener('beforeunload', beforeunloadHandler);
  };
};

export const updateActiveNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setActiveNode(nodeId));
  };
};
