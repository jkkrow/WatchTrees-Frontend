import axios, { AxiosResponse } from 'axios';

import { AppThunk } from 'store';
import { uploadActions } from 'store/reducers/upload-reducer';
import { uiActions } from 'store/reducers/ui-reducer';
import { beforeunloadHandler } from 'util/event-handlers';

export const initiateUpload = (): AppThunk => {
  return (dispatch) => {
    dispatch(uploadActions.initiateUpload());

    window.addEventListener('beforeunload', beforeunloadHandler);
  };
};

export const uploadVideo = (
  file: File,
  nodeId: string,
  treeId: string
): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());

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
        selectionTimeStart: null,
        selectionTimeEnd: null,
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
      const response = await client.get('/upload/multipart-id', {
        params: {
          treeId,
          nodeId,
          fileName: file.name,
          fileType: file.type,
        },
      });

      const { uploadId } = response.data;

      const fileSize = file.size;
      const CHUNK_SIZE = 10000000; // 10MB
      const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
      const promisesArray: Promise<AxiosResponse>[] = [];
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
        const getUploadUrlResponse = await client.get('/upload/multipart-url', {
          params: {
            uploadId,
            treeId,
            fileName: file.name,
            partNumber: index,
          },
        });

        const { presignedUrl } = getUploadUrlResponse.data;

        // Save Promises
        const uploadPromise = axios.put(presignedUrl, blob, {
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
      const completeUploadReseponse = await client.post('/upload/video', {
        params: {
          uploadId,
          treeId,
          fileName: file.name,
          parts: uploadPartsArray,
        },
      });

      dispatch(uploadActions.setNode({ info: { progress: 100 }, nodeId }));

      const { url } = completeUploadReseponse.data;

      dispatch(
        uploadActions.setNode({ type: 'uploadTree', info: { url }, nodeId })
      );

      dispatch(saveUpload());
    } catch (err) {
      console.log(err);
      dispatch(
        uploadActions.setNode({
          info: { error: `${(err as Error).message}` },
          nodeId,
        })
      );
    }
  };
};

export const saveUpload = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree } = getState().upload;

    if (!uploadTree) return;

    const client = dispatch(api());

    try {
      const saveRepsonse = await client.put('/upload/video', {
        uploadTree,
      });

      dispatch(uploadActions.saveUpload());

      dispatch(
        uiActions.setMessage({
          content: saveRepsonse.data.message,
          type: 'message',
          timer: 3000,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.setMessage({
          content: `${(err as Error).message}: Saving upload failed`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const uploadThumbnail = (file: File): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree } = getState().upload;

    if (!uploadTree) return;

    const client = dispatch(api());

    try {
      const thumbnailInfo = {
        name: file.name,
        url: URL.createObjectURL(file),
      };

      dispatch(
        uploadActions.setTree({
          type: 'previewTree',
          info: { thumbnail: thumbnailInfo },
        })
      );

      const response = await client.put('/upload/thumbnail', {
        thumbnail: uploadTree.thumbnail,
        fileType: file.type,
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
      dispatch(
        uploadActions.setTree({ info: { thumbnail: { name: '', url: '' } } })
      );
      dispatch(
        uiActions.setMessage({
          content: `${
            (err as Error).message
          }: Uploading thumbnail failed. Please try again`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const deleteThumbnail = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree, previewTree } = getState().upload;

    if (!uploadTree || !previewTree) return;

    const client = dispatch(api());

    const previewThumbnailInfo = previewTree.thumbnail;

    try {
      dispatch(
        uploadActions.setTree({
          type: 'previewTree',
          info: { thumbnail: { name: '', url: '' } },
        })
      );

      await client.delete('/upload/thumbnail', {
        params: { key: uploadTree.thumbnail.url },
      });

      dispatch(
        uploadActions.setTree({
          type: 'uploadTree',
          info: { thumbnail: { name: '', url: '' } },
        })
      );

      dispatch(saveUpload());
    } catch (err) {
      dispatch(
        uploadActions.setTree({
          type: 'previewTree',
          info: { thumbnail: previewThumbnailInfo },
        })
      );
      dispatch(
        uiActions.setMessage({
          content: `${
            (err as Error).message
          }: Deleting thumbnail failed. Please try again`,
          type: 'error',
          timer: 5000,
        })
      );
    }
  };
};

export const finishUpload = (): AppThunk => {
  return (dispatch) => {
    dispatch(uploadActions.finishUpload());

    window.removeEventListener('beforeunload', beforeunloadHandler);
  };
};
