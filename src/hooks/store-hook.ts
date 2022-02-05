import { useState, useCallback, useRef, useEffect } from 'react';
import { Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppState, AppThunk, AppExtraArgument } from 'store';
import { uiActions } from 'store/slices/ui-slice';

type NonUndefined<T> = T extends undefined ? never : T;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<AppState, AppExtraArgument, Action>>();

export const useAppThunk = <T = any>(
  initialData?: T,
  options: { errorMessage?: boolean | string } = { errorMessage: true }
) => {
  const [data, setData] = useState(initialData as NonUndefined<T>);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnmounted = useRef(false);

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  const dispatch = useAppDispatch();

  const dispatchThunk = useCallback(
    async (thunk: AppThunk) => {
      try {
        setLoading(true);

        const data = await dispatch(thunk);

        if (isUnmounted.current) {
          return;
        }

        data && setData(data);
        setLoading(false);
        setLoaded(true);
      } catch (err) {
        setLoading(false);
        setLoaded(true);
        setError((err as Error).message);

        if (options.errorMessage) {
          const msg =
            typeof options.errorMessage === 'string'
              ? `: ${options.errorMessage}`
              : '';

          dispatch(
            uiActions.setMessage({
              type: 'error',
              content: (err as Error).message + msg,
            })
          );
        }

        throw err;
      }
    },
    [dispatch, options.errorMessage]
  );

  return { dispatchThunk, setData, data, loading, loaded, error };
};
