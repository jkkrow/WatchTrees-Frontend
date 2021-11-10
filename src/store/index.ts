import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import authReducer from './reducers/auth-reducer';
import uploadReducer from './reducers/upload-reducer';
import userReducer from './reducers/user-reducer';
import videoReducer from './reducers/video-reducer';
import uiReducer from './reducers/ui-reducer';
import { api } from './middlwares/api';

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
