import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserData } from '../types/user';

const refreshTokenStorage = localStorage.getItem('refreshToken');

interface AuthSliceState {
  refreshToken: string | null;
  accessToken: string | null;
}

interface SigninPayload extends AuthSliceState {
  userData: UserData;
}

const initialState: AuthSliceState = {
  accessToken: null,
  refreshToken: refreshTokenStorage
    ? (JSON.parse(refreshTokenStorage) as string)
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signin: (state, { payload }: PayloadAction<SigninPayload>) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },

    signout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },

    setRefreshToken: (
      state,
      { payload }: PayloadAction<AuthSliceState['refreshToken']>
    ) => {
      state.refreshToken = payload;
    },

    setAccessToken: (
      state,
      { payload }: PayloadAction<AuthSliceState['accessToken']>
    ) => {
      state.accessToken = payload;
    },

    setVerified: () => {},
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
