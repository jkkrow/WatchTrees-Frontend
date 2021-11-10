import { Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppState, AppExtraArgument } from 'store';

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<AppState, AppExtraArgument, Action>>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
