import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface authSliceState {
  accessToken: string | null;
  refreshToken: { value: string; expiresIn: number } | null;
  userData: {
    name: string;
    email: string;
    picture: string;
    isVerified: boolean;
    isPremium: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const refreshTokenJSON = localStorage.getItem('refreshToken');
const userDataJSON = localStorage.getItem('userData');

const initialState: authSliceState = {
  accessToken: null,
  refreshToken: refreshTokenJSON ? JSON.parse(refreshTokenJSON) : null,
  userData: userDataJSON ? JSON.parse(userDataJSON) : null,
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

    login: (state, { payload }) => {
      state.loading = false;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.userData = payload.userData;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userData = null;
    },

    setRefreshToken: (state, { payload }) => {
      state.refreshToken = payload.refreshToken;
    },

    setAccessToken: (state, { payload }) => {
      state.accessToken = payload.accessToken;
    },

    setUserData: (state, { payload }) => {
      state.userData = {
        ...state.userData,
        ...payload.info,
      };
    },

    clearResponse: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
