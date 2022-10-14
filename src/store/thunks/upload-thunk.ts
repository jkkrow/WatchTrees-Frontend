import axios, { AxiosResponse } from 'axios';

import { AppThunk } from 'store';
import { uploadActions } from 'store/slices/upload-slice';
import { findById, traverseNodes } from 'util/tree';

export const initiateUpload = (): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());
    const { data } = await client.post('/video-trees');

    dispatch(uploadActions.initiateUpload(data));
  };
};

export const continueUpload = (id: string): AppThunk => {
  return async (dispatch, _, api) => {
    const client = dispatch(api());
    const { data } = await client.get(`/video-trees/created/${id}`);

    dispatch(uploadActions.initiateUpload(data));
  };
};

export const uploadVideo = (file: File, nodeId: string): AppThunk => {
  return async (dispatch, getState, api) => {
    const { sourceTree, renderTree } = getState().upload;
    const client = dispatch(api());

    if (!sourceTree || !renderTree) return;

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
      };

      dispatch(
        uploadActions.updateNode({
          id: nodeId,
          info: nodeInfo,
        })
      );
      dispatch(
        uploadActions.updateNode({
          id: nodeId,
          info: { url: URL.createObjectURL(file) },
          exclude: 'source',
        })
      );

      // Check if file is duplicated
      const uploadNodes = traverseNodes(sourceTree.root);

      for (let node of uploadNodes) {
        if (node.name === file.name && node.size === file.size) {
          // match current node's prgress state and url
          const previewUrl = findById(renderTree, node._id)!.url;

          dispatch(
            uploadActions.updateNode({
              id: nodeId,
              info: { url: node.url },
              exclude: 'render',
            })
          );
          dispatch(
            uploadActions.updateNode({
              id: nodeId,
              info: { progress: 100, url: previewUrl },
              exclude: 'source',
            })
          );

          return;
        }
      }

      /**
       * Initiate upload
       */
      const response = await client.post('/upload/multipart', {
        videoId: sourceTree._id,
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadId } = response.data;

      const progressArray: number[] = [];

      const getDuplicatedNodeIds = () => {
        const sourceTree = getState().upload.sourceTree!;
        const uploadNodes = traverseNodes(sourceTree.root);

        const duplicatedNodeIds: string[] = [];

        for (let node of uploadNodes) {
          if (node.name === file.name && node.size === file.size) {
            duplicatedNodeIds.push(node._id);
          }
        }

        return duplicatedNodeIds;
      };
      const uploadProgressHandler = (index: number, count: number) => {
        return (event: ProgressEvent) => {
          if (event.loaded >= event.total) return;

          const currentProgress = Math.round(event.loaded * 100) / event.total;
          progressArray[index - 1] = currentProgress;
          const sum = progressArray.reduce((acc, cur) => acc + cur);
          const progress = Math.round(sum / count);

          for (let id of getDuplicatedNodeIds()) {
            dispatch(
              uploadActions.updateNode({
                id,
                info: { progress },
                exclude: 'source',
              })
            );
          }
        };
      };

      /**
       * Upload Parts
       */
      const partSize = 10 * 1024 * 1024; // 10MB
      const partCount = Math.floor(file.size / partSize) + 1;

      // get presigned urls for each parts
      const getUrlResponse = await client.put(`/upload/multipart/${uploadId}`, {
        videoId: sourceTree._id,
        fileName: file.name,
        partCount,
      });

      const { presignedUrls } = getUrlResponse.data;
      const uploadPartPromises: Promise<AxiosResponse>[] = [];

      presignedUrls.forEach((presignedUrl: string, index: number) => {
        const partNumber = index + 1;
        const start = index * partSize;
        const end = partNumber * partSize;
        const blob =
          partNumber < partCount ? file.slice(start, end) : file.slice(start);

        const uploadPartPromise = axios.put(presignedUrl, blob, {
          onUploadProgress: uploadProgressHandler(partNumber, partCount),
          headers: { 'Content-Type': file.type },
        });

        uploadPartPromises.push(uploadPartPromise);
      });

      // upload parts to aws s3
      const uploadPartResponses = await Promise.all(uploadPartPromises);
      const uploadParts = uploadPartResponses.map(
        (uploadPartResponse, index) => ({
          ETag: uploadPartResponse.headers.etag,
          PartNumber: index + 1,
        })
      );

      /**
       * Complete upload
       */
      const completeUploadReseponse = await client.post(
        `/upload/multipart/${uploadId}`,
        {
          videoId: sourceTree._id,
          fileName: file.name,
          parts: uploadParts,
        }
      );

      const { url } = completeUploadReseponse.data;

      for (let id of getDuplicatedNodeIds()) {
        dispatch(
          uploadActions.updateNode({
            id,
            info: { url },
            exclude: 'render',
          })
        );
        dispatch(
          uploadActions.updateNode({
            id,
            info: { progress: 100 },
            exclude: 'source',
          })
        );
      }

      return await dispatch(saveUpload());
    } catch (err) {
      dispatch(
        uploadActions.updateNode({
          id: nodeId,
          info: { error: `${(err as Error).message}` },
          exclude: 'source',
        })
      );
    }
  };
};

export const updateThumbnail = (file: File): AppThunk => {
  return async (dispatch, getState, api) => {
    const sourceTree = getState().upload.sourceTree;
    const client = dispatch(api());

    if (!sourceTree) return;

    const { data } = await client.put('/upload/image', {
      key: sourceTree.thumbnail,
      fileType: file ? file.type : null,
    });

    await axios.put(data.presignedUrl, file, {
      headers: { 'Content-Type': file.type },
    });

    dispatch(
      uploadActions.updateTree({
        info: { thumbnail: data.key },
      })
    );

    return await dispatch(saveUpload());
  };
};

export const deleteThumbnail = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const sourceTree = getState().upload.sourceTree;
    const client = dispatch(api());

    if (!sourceTree) return;

    await client.delete('/upload/image', {
      params: { key: sourceTree.thumbnail },
    });

    dispatch(
      uploadActions.updateTree({
        info: { thumbnail: '' },
      })
    );

    return await dispatch(saveUpload());
  };
};

export const saveUpload = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const sourceTree = getState().upload.sourceTree;
    const client = dispatch(api());

    if (!sourceTree) return;

    const { data } = await client.patch(`/video-trees/${sourceTree._id}`, {
      sourceTree,
    });

    dispatch(uploadActions.saveUpload());

    return data;
  };
};

export const submitUpload = (): AppThunk => {
  return async (dispatch) => {
    dispatch(uploadActions.updateTree({ info: { isEditing: false } }));

    const data = await dispatch(saveUpload());

    dispatch(uploadActions.finishUpload());

    return data;
  };
};
