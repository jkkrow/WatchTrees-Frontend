import axios, { AxiosResponse } from 'axios';

import { AppThunk } from 'store';
import { uploadActions } from 'store/slices/upload-slice';
import { uiActions } from 'store/slices/ui-slice';
import { findById, traverseNodes } from 'util/tree';

export const initiateUpload = (): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());
    const { data } = await client.post('/videos');

    dispatch(uploadActions.initiateUpload(data.video));
  };
};

export const continueUpload = (id: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());
    const { data } = await client.get(`/videos/${id}`);

    dispatch(uploadActions.initiateUpload(data.video));
  };
};

export const uploadVideo = (file: File, nodeId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { uploadTree, previewTree } = getState().upload;
    const client = dispatch(api());

    if (!uploadTree || !previewTree) return;

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
        label: `Select ${file.name}`,
        selectionTimeStart:
          videoDuration > 10
            ? +(videoDuration - 10).toFixed(3)
            : +videoDuration.toFixed(3),
        selectionTimeEnd: +videoDuration.toFixed(3),
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
          const previewUrl = findById(previewTree, node._id)!.info!.url;

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

      const response = await client.post('/videos/upload/multipart', {
        videoId: uploadTree._id,
        isRoot: nodeId === uploadTree.root._id,
        fileName: file.name,
        fileType: file.type,
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
            duplicatedNodeIds.push(node._id);
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
        const getUploadUrlResponse = await client.put(
          `/videos/upload/multipart/${uploadId}`,
          {
            videoId: uploadTree._id,
            fileName: file.name,
            partNumber: index,
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
        `/videos/upload/multipart/${uploadId}`,
        {
          videoId: uploadTree._id,
          fileName: file.name,
          parts: uploadPartsArray,
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

      dispatch(saveUpload('Upload progress saved'));
    } catch (err) {
      dispatch(
        uploadActions.setNode({
          info: { error: `${(err as Error).message}` },
          nodeId,
        })
      );
    }
  };
};

export const updateThumbnail = (file?: File): AppThunk => {
  return async (dispatch, getState, api) => {
    const uploadTree = getState().upload.uploadTree;
    const client = dispatch(api());

    if (!uploadTree) return;

    const response = await client.patch('/videos/upload/thumbnail', {
      key: uploadTree.info.thumbnail.url,
      isNewFile: !!file,
      fileType: file ? file.type : null,
    });

    const { presignedUrl, key } = response.data;

    if (file) {
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
      });
    }

    dispatch(
      uploadActions.setTree({
        info: {
          thumbnail: { name: file ? file.name : '', url: file ? key : '' },
        },
      })
    );

    dispatch(saveUpload('Video thumbnail has updated'));
  };
};

export const saveUpload = (message: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const uploadTree = getState().upload.uploadTree;
    const client = dispatch(api());

    if (!uploadTree) return;

    await client.patch(`/videos/${uploadTree._id}`, { uploadTree });

    dispatch(uploadActions.saveUpload());

    dispatch(
      uiActions.setMessage({
        type: 'message',
        content: message,
        timer: 3000,
      })
    );
  };
};

export const submitUpload = (): AppThunk => {
  return async (dispatch) => {
    dispatch(uploadActions.setTree({ info: { isEditing: false } }));

    await dispatch(saveUpload('Video uploaded successfully'));

    dispatch(uploadActions.finishUpload());
  };
};
