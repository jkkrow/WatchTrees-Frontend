import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserData } from './user';

export interface RefreshToken {
  value: string;
  expiresIn: number;
}

interface AuthSliceState {
  accessToken: string | null;
  refreshToken: RefreshToken | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const refreshTokenJSON = localStorage.getItem('refreshToken');

const initialState: AuthSliceState = {
  accessToken: null,
  refreshToken: refreshTokenJSON
    ? (JSON.parse(refreshTokenJSON) as RefreshToken)
    : null,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.message = payload;
    },

    authFail: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.error = payload;
    },

    login: (
      state,
      {
        payload,
      }: PayloadAction<{
        accessToken: string;
        refreshToken: RefreshToken;
        userData: UserData;
      }>
    ) => {
      state.loading = false;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },

    setRefreshToken: (state, { payload }: PayloadAction<RefreshToken>) => {
      state.refreshToken = payload;
    },

    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },

    clearResponse: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
