import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth-reducer';
import uploadReducer from './reducers/upload-reducer';
import userReducer from './reducers/user-reducer';
import videoReducer from './reducers/video-reducer';
import uiReducer from './reducers/ui-reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    user: userReducer,
    video: videoReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
