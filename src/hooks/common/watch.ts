import { useCallback, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from './store';
import { authActions } from 'store/slices/auth-slice';

export const useStorageWatcher = (key: string, value: any) => {
  useEffect(() => {
    value
      ? localStorage.setItem(key, JSON.stringify(value))
      : localStorage.removeItem(key);
  }, [key, value]);
};

export const useAuthWatcher = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener('storage', (event) => {
      if (event.key !== 'refreshToken') return;
      if (event.oldValue && !event.newValue) {
        dispatch(authActions.signout());
      }
    });
  }, [dispatch]);
};

export const useUploadWatcher = () => {
  const uploadTree = useAppSelector((state) => state.upload.uploadTree);

  const beforeunloadHandler = useCallback((event: BeforeUnloadEvent): void => {
    event.preventDefault();
    event.returnValue = '';
  }, []);

  useEffect(() => {
    uploadTree
      ? window.addEventListener('beforeunload', beforeunloadHandler)
      : window.removeEventListener('beforeunload', beforeunloadHandler);
  }, [uploadTree, beforeunloadHandler]);
};
