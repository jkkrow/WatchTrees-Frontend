import axios from 'axios';

import { uploadActions } from 'store/reducers/upload';
import { beforeunloadHandler } from 'util/event-handlers';

export const initiateUpload = () => {
  return (dispatch) => {
    dispatch(uploadActions.initiateUpload());

    window.addEventListener('beforeunload', beforeunloadHandler);
  };
};

export const appendChild = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.appendChild({
        nodeId,
      })
    );
  };
};

export const attachVideo = (file, nodeId, treeId, accessToken) => {
  return async (dispatch, getState) => {
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

      dispatch(
        uploadActions.setPreviewNode({
          info: {
            name: file.name,
            label: 'Default',
            timelineStart: null,
            timelineEnd: null,
            url: URL.createObjectURL(file),
          },
          nodeId,
        })
      );

      const response = await axios.get('/upload/initiate-upload', {
        params: {
          treeId,
          fileName: file.name,
          fileType: file.type,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { uploadId } = response.data;

      dispatch(
        uploadActions.setUploadNode({
          info: {
            uploadId,
          },
          nodeId,
        })
      );

      const fileSize = file.size;
      const CHUNK_SIZE = 10000000; // 10MB
      const CHUNKS_COUNT = Math.floor(fileSize / CHUNK_SIZE) + 1;
      const promisesArray = [];
      const progressArray = [];

      let start, end, blob;

      const uploadProgressHandler = async (progressEvent, index) => {
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

        // Initiate Upload
        const getUploadUrlResponse = await axios.get('/upload/get-upload-url', {
          params: {
            uploadId,
            partNumber: index,
            treeId,
            fileName: file.name,
          },
        });

        const { presignedUrl } = getUploadUrlResponse.data;

        // Upload Parts
        const uploadResponse = axios.put(presignedUrl, blob, {
          onUploadProgress: (e) => uploadProgressHandler(e, index),
          headers: {
            'Content-Type': file.type,
          },
        });
        promisesArray.push(uploadResponse);
      }

      const resolvedArray = await Promise.all(promisesArray);

      const uploadPartsArray = [];
      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.headers.etag,
          PartNumber: index + 1,
        });
      });

      // Complete Upload
      const completeUploadResponse = await axios.post(
        '/upload/complete-upload',
        {
          params: {
            uploadId,
            parts: uploadPartsArray,
            treeId,
            fileName: file.name,
          },
        }
      );

      const { url } = completeUploadResponse.data;

      console.log(getState());

      dispatch(
        uploadActions.setUploadNode({
          info: { progress: 100, url },
          nodeId,
        })
      );

      dispatch(
        uploadActions.saveTree({
          saved: false,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateNode = (info, nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.setUploadNode({
        info,
        nodeId,
      })
    );

    dispatch(
      uploadActions.setPreviewNode({
        info,
        nodeId,
      })
    );
  };
};

export const removeNode = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.removeNode({
        nodeId,
      })
    );
  };
};

export const updateTree = (info) => {
  return (dispatch) => {
    dispatch(
      uploadActions.setUploadTree({
        info,
      })
    );
  };
};

export const removeTree = () => {
  return (dispatch) => {
    dispatch(uploadActions.removeTree());

    window.removeEventListener('beforeunload', beforeunloadHandler);
  };
};

export const saveUploadTree = (tree, accessToken) => {
  return async (dispatch) => {
    try {
      await axios.post(
        '/upload/save-upload',
        { tree },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      console.log(err);
    }

    dispatch(
      uploadActions.saveTree({
        saved: true,
      })
    );
  };
};

export const setWarning = (data) => {
  return (dispatch) => {
    dispatch(
      uploadActions.setWarning({
        warning: data,
      })
    );
  };
};

export const updateActiveNode = (nodeId) => {
  return (dispatch) => {
    dispatch(
      uploadActions.setActiveNode({
        nodeId,
      })
    );
  };
};
