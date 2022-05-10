import axios, { AxiosResponse } from 'axios';

import { AppThunk } from 'store';
import { uploadActions } from 'store/slices/upload-slice';
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
    const { data } = await client.get(`/videos/created/${id}`);

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
      const response = await client.post('/upload/multipart', {
        videoId: uploadTree._id,
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadId } = response.data;

      const progressArray: number[] = [];

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
      const uploadProgressHandler = (index: number, count: number) => {
        return (event: ProgressEvent) => {
          if (event.loaded >= event.total) return;

          const currentProgress = Math.round(event.loaded * 100) / event.total;
          progressArray[index - 1] = currentProgress;
          const sum = progressArray.reduce((acc, cur) => acc + cur);
          const progress = Math.round(sum / count);

          for (let id of getDuplicatedNodeIds()) {
            dispatch(uploadActions.setNode({ info: { progress }, nodeId: id }));
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
        videoId: uploadTree._id,
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
          videoId: uploadTree._id,
          fileName: file.name,
          parts: uploadParts,
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

      return await dispatch(saveUpload());
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

export const updateThumbnail = (file: File): AppThunk => {
  return async (dispatch, getState, api) => {
    const uploadTree = getState().upload.uploadTree;
    const client = dispatch(api());

    if (!uploadTree) return;

    const { data } = await client.put('/upload/image', {
      key: uploadTree.info.thumbnail.url,
      fileType: file ? file.type : null,
    });

    await axios.put(data.presignedUrl, file, {
      headers: { 'Content-Type': file.type },
    });

    dispatch(
      uploadActions.setTree({
        info: { thumbnail: { name: file.name, url: data.key } },
      })
    );

    return await dispatch(saveUpload());
  };
};

export const deleteThumbnail = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const uploadTree = getState().upload.uploadTree;
    const client = dispatch(api());

    if (!uploadTree) return;

    await client.delete('/upload/image', {
      params: { key: uploadTree.info.thumbnail.url },
    });

    dispatch(
      uploadActions.setTree({
        info: { thumbnail: { name: '', url: '' } },
      })
    );

    return await dispatch(saveUpload());
  };
};

export const saveUpload = (): AppThunk => {
  return async (dispatch, getState, api) => {
    const uploadTree = getState().upload.uploadTree;
    const client = dispatch(api());

    if (!uploadTree) return;

    const { data } = await client.patch(`/videos/${uploadTree._id}`, {
      uploadTree,
    });

    dispatch(uploadActions.saveUpload());

    return data;
  };
};

export const submitUpload = (): AppThunk => {
  return async (dispatch) => {
    dispatch(uploadActions.setTree({ info: { isEditing: false } }));

    const data = await dispatch(saveUpload());

    dispatch(uploadActions.finishUpload());

    return data;
  };
};
