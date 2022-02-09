import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigationType } from 'react-router-dom';
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
  options: { errorMessage?: boolean | string; forceUpdate?: boolean } = {
    errorMessage: true,
  }
) => {
  const [data, setData] = useState(initialData as NonUndefined<T>);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnmounted = useRef(false);
  const optionsRef = useRef(options);
  const reload = useRef<ReturnType<AppThunk>>();
  const type = useNavigationType();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const dispatchThunk = useCallback(
    async (thunk: AppThunk, retry = false) => {
      const { errorMessage, forceUpdate } = optionsRef.current;
      try {
        setLoading(true);

        reload.current = async () => await dispatchThunk(thunk, true);

        const data = await dispatch((dispatch, getState, api) => {
          const client = dispatch(api(retry || forceUpdate || type !== 'POP'));
          return thunk(dispatch, getState, () => () => client);
        });

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

        if (errorMessage) {
          const msg =
            typeof errorMessage === 'string' ? `: ${errorMessage}` : '';

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
    [dispatch, type]
  );

  return {
    dispatchThunk,
    setData,
    reload: reload.current,
    data,
    loading,
    loaded,
    error,
  };
};
