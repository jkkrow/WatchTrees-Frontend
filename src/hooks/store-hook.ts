import { useState, useCallback } from 'react';
import { Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppState, AppThunk, AppExtraArgument } from 'store';

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useAppDispatch = <T = any>(initialData?: T) => {
  const [data, setData] = useState(initialData!);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const dispatch =
    useDispatch<ThunkDispatch<AppState, AppExtraArgument, Action>>();

  const dispatchThunk = useCallback(
    async (thunk: AppThunk) => {
      try {
        setLoading(true);

        const data = await dispatch(thunk);

        data && setData(data);

        setLoading(false);
        setLoaded(true);
      } catch (err) {
        setLoading(false);
        setLoaded(true);

        throw err;
      }
    },
    [dispatch]
  );

  return { dispatch, dispatchThunk, data, setData, loading, loaded };
};
