import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RefreshToken {
  value: string;
  expiresIn: number;
}

interface UserData {
  name: string;
  email: string;
  picture: string;
  isVerified: boolean;
  isPremium: boolean;
}

interface AuthSliceState {
  accessToken: string | null;
  refreshToken: RefreshToken | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const refreshTokenJSON = localStorage.getItem('refreshToken');
const userDataJSON = localStorage.getItem('userData');

const initialState: AuthSliceState = {
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
      state.userData = payload.userData;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userData = null;
    },

    setRefreshToken: (state, { payload }: PayloadAction<RefreshToken>) => {
      state.refreshToken = payload;
    },

    setAccessToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },

    setUserData: (state, { payload }: PayloadAction<any>) => {
      state.userData = {
        ...state.userData,
        ...payload,
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
