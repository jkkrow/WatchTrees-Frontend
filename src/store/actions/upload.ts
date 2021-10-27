import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import { RootState, AppDispatch } from 'store';
import { uploadActions, UploadTree } from 'store/reducers/upload';
import { beforeunloadHandler } from 'util/event-handlers';

export const initiateUpload = () => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.initiateUpload());

    window.addEventListener('beforeunload', beforeunloadHandler);
  };
};

export const appendChild = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.appendChild(nodeId));
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

      dispatch(
        uploadActions.setUploadNode({
          info: {
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            duration: videoDuration,
            label: 'Default',
            timelineStart: null,
            timelineEnd: null,
            progress: 0,
            error: null,
          },
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
          uploadActions.setUploadNode({
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
        uploadActions.setUploadNode({
          info: { progress: 100 },
          nodeId,
        })
      );

      const { url } = completeUploadReseponse.data;

      dispatch(
        uploadActions.saveTree({
          info: { url },
          nodeId,
        })
      );
    } catch (err) {
      let error = err as AxiosError;
      // dispatch(
      //   uploadActions.setUploadNode({
      //     info: { error: error.response?.data?.message || error.message },
      //     nodeId,
      //   })
      // );
      console.log(error);
    }

    dispatch(saveUpload());
  };
};

export const saveUpload = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get current upload state
      const { auth, upload } = getState();

      const savedTree = upload.savedTree as UploadTree;
      const accessToken = auth.accessToken as string;

      const saveRepsonse = await axios.post(
        '/upload/save-upload',
        { savedTree },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // TODO: Add Global message
      console.log(saveRepsonse.data.message);
    } catch (err) {
      // TODO: Add Global message
      console.log(err);
    }
  };
};

export const updateNode = (info: any, nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(
      uploadActions.setUploadNode({
        info,
        nodeId,
      })
    );
  };
};

export const removeNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.removeNode(nodeId));
  };
};

export const updateTree = (info: any) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setUploadTree(info));
  };
};

export const removeTree = () => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.removeTree());

    window.removeEventListener('beforeunload', beforeunloadHandler);
  };
};

export const saveUploadTree = (tree: UploadTree, accessToken: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.post(
        '/upload/save-upload',
        { tree },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateActiveNode = (nodeId: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(uploadActions.setActiveNode(nodeId));
  };
};
