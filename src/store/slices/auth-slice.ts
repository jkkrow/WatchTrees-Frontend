import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  type: 'native' | 'google';
  name: string;
  email: string;
  picture: string;
  isVerified: boolean;
  isPremium: boolean;
}

interface AuthSliceState {
  accessToken: string | null;
  refreshToken: string | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const refreshTokenStorage = localStorage.getItem('refreshToken');
const userDataStorage = localStorage.getItem('userData');

const initialState: AuthSliceState = {
  accessToken: null,
  refreshToken: refreshTokenStorage
    ? (JSON.parse(refreshTokenStorage) as string)
    : null,
  userData: userDataStorage ? (JSON.parse(userDataStorage) as UserData) : null,
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
      state.message = null;
    },

    authSuccess: (state, { payload }: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.message = payload || null;
    },

    authFail: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.error = payload;
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

    setUserData: (
      state,
      { payload }: PayloadAction<AuthSliceState['userData']>
    ) => {
      state.userData = payload;
    },

    clearResponse: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
