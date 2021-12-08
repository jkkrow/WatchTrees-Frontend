import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import authReducer from './slices/auth-slice';
import uploadReducer from './slices/upload-slice';
import userReducer from './slices/user-slice';
import videoReducer from './slices/video-slice';
import uiReducer from './slices/ui-slice';
import { api } from './middlewares/api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    user: userReducer,
    video: videoReducer,
    ui: uiReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ thunk: { extraArgument: api } }),
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export type AppExtraArgument = typeof api;
export type AppThunk<T = any> = ThunkAction<
  T,
  AppState,
  AppExtraArgument,
  Action
>;

export default store;
