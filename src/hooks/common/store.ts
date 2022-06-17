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

export const useAppThunk = <T = any>(initialData?: T) => {
  const [data, setData] = useState(initialData as NonUndefined<T>);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const navigationType = useNavigationType();
  const dispatch = useAppDispatch();

  const isUnmounted = useRef(false);
  const type = useRef(navigationType);
  const reload = useRef<ReturnType<AppThunk>>();

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      type.current = navigationType;
    };
  }, [navigationType]);

  const dispatchThunk = useCallback(
    async (
      thunk: AppThunk,
      options?: {
        response?: { message?: boolean; timer?: number };
        forceUpdate?: boolean;
      }
    ) => {
      const forceUpdate = options?.forceUpdate;
      const response = {
        message: options?.response?.message ?? true,
        timer: options?.response?.timer ?? undefined,
      };

      try {
        setLoading(true);

        reload.current = async () =>
          await dispatchThunk(thunk, {
            ...options,
            forceUpdate: true,
          });

        const data = await dispatch((dispatch, getState, api) => {
          const client = dispatch(api(forceUpdate ?? type.current !== 'POP'));
          return thunk(dispatch, getState, () => () => client);
        });

        if (isUnmounted.current) {
          return;
        }

        data && setData(data);
        setLoading(false);
        setLoaded(true);

        if (data && data.message) {
          setMessage(data.message);

          response?.message &&
            dispatch(
              uiActions.setMessage({
                type: 'message',
                content: data.message,
                timer: response.timer || 5000,
              })
            );
        }
      } catch (err) {
        setLoading(false);
        setLoaded(true);
        setError((err as Error).message);

        response?.message &&
          dispatch(
            uiActions.setMessage({
              type: 'error',
              content: (err as Error).message,
              timer: response.timer,
            })
          );

        throw err;
      }
    },
    [dispatch]
  );

  return {
    dispatchThunk,
    setData,
    reload: reload.current,
    data,
    loading,
    loaded,
    error,
    message,
  };
};
