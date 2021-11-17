import axios, { AxiosResponse } from 'axios';

import { AppThunk } from 'store';
import { uploadActions } from 'store/slices/upload-slice';
import { uiActions } from 'store/slices/ui-slice';
import { saveVideo } from './video-thunk';
import { beforeunloadHandler } from 'util/event-handlers';
import { findById, traverseNodes } from 'util/tree';

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
  return async (dispatch, getState, api) => {
    const { uploadTree, previewTree } = getState().upload;

    if (!uploadTree || !previewTree) return;

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

      // Check if file is duplicated

      const uploadNodes = traverseNodes(uploadTree.root);

      for (let node of uploadNodes) {
        if (!node.info) continue;

        if (node.info.name === file.name && node.info.size === file.size) {
          // match current node's prgress state and url
          const previewUrl = findById(previewTree, node.id)!.info!.url;

          dispatch(
            uploadActions.setNode({
              type: 'uploadTree',
              info: { progress: node.info.progress, url: node.info.url },
              nodeId,
            })
          );
          dispatch(
            uploadActions.setNode({
              type: 'previewTree',
              info: { progress: node.info.progress, url: previewUrl },
              nodeId,
            })
          );

          return;
        }
      }

      /**
       * Initiate upload
       */

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

      const getDuplicatedNodeIds = () => {
        const uploadTree = getState().upload.uploadTree!;
        const uploadNodes = traverseNodes(uploadTree.root);

        const duplicatedNodeIds: string[] = [];

        for (let node of uploadNodes) {
          if (!node.info) continue;

          if (node.info.name === file.name && node.info.size === file.size) {
            duplicatedNodeIds.push(node.id);
          }
        }

        return duplicatedNodeIds;
      };
      const uploadProgressHandler = async (
        event: ProgressEvent,
        index: number
      ) => {
        if (event.loaded >= event.total) return;

        const currentProgress = Math.round(event.loaded * 100) / event.total;

        progressArray[index - 1] = currentProgress;
        const sum = progressArray.reduce((acc, cur) => acc + cur);
        const progress = Math.round(sum / CHUNKS_COUNT);

        for (let id of getDuplicatedNodeIds()) {
          dispatch(
            uploadActions.setNode({
              info: { progress },
              nodeId: id,
            })
          );
        }
      };

      for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
        start = (index - 1) * CHUNK_SIZE;
        end = index * CHUNK_SIZE;
        blob =
          index < CHUNKS_COUNT ? file.slice(start, end) : file.slice(start);

        // Get presigned urls
        const getUploadUrlResponse = await client.get(
          '/upload/multipart-presigned-url',
          {
            params: {
              uploadId,
              treeId,
              fileName: file.name,
              partNumber: index,
            },
          }
        );

        const { presignedUrl } = getUploadUrlResponse.data;

        // Save promises
        const uploadPromise = axios.put(presignedUrl, blob, {
          onUploadProgress: (e) => uploadProgressHandler(e, index),
          headers: {
            'Content-Type': file.type,
          },
        });
        promisesArray.push(uploadPromise);
      }

      // Upload parts
      const resolvedArray = await Promise.all(promisesArray);

      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag,
          PartNumber: index + 1,
        });
      });

      /**
       * Complete upload
       */

      const completeUploadReseponse = await client.post(
        '/upload/multipart-parts',
        {
          params: {
            uploadId,
            treeId,
            fileName: file.name,
            parts: uploadPartsArray,
          },
        }
      );

      const { url } = completeUploadReseponse.data;

      for (let id of getDuplicatedNodeIds()) {
        dispatch(
          uploadActions.setNode({
            info: { progress: 100 },
            nodeId: id,
          })
        );
        dispatch(
          uploadActions.setNode({
            type: 'uploadTree',
            info: { url },
            nodeId: id,
          })
        );
      }

      dispatch(saveVideo());
    } catch (err) {
      // dispatch(
      //   uploadActions.setNode({
      //     info: { error: `${(err as Error).message}` },
      //     nodeId,
      //   })
      // );
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

      dispatch(saveVideo('Thumbnail uploaded'));
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

      dispatch(saveVideo('Thumbnail deleted'));
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

export const finishUpload = (save: boolean = false): AppThunk => {
  return async (dispatch) => {
    if (save) {
      dispatch(
        uploadActions.setTree({
          info: { isEditing: false },
        })
      );

      await dispatch(saveVideo('Video uploaded successfully'));
    }

    dispatch(uploadActions.finishUpload());

    window.removeEventListener('beforeunload', beforeunloadHandler);
  };
};
