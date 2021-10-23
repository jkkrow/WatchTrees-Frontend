import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: JSON.parse(localStorage.getItem('refreshToken') || 'null'),
    userData: JSON.parse(localStorage.getItem('userData') || 'null'),
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    authSuccess: (state, { payload }) => {
      state.loading = false;
      state.message = payload.message;
    },

    authFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload.error;
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
