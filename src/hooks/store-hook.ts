import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from 'store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAuthSelector = () =>
  useSelector((state: RootState) => state.auth);
export const useUploadSelector = () =>
  useSelector((state: RootState) => state.upload);
export const useUserSelector = () =>
  useSelector((state: RootState) => state.user);
export const useVideoSelector = () =>
  useSelector((state: RootState) => state.video);
