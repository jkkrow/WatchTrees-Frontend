import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChannelData {
  _id: string;
  name: string;
  picture: string;
  subscribers: number;
  subsscribes: number;
  isSubscribed: boolean;
}

export interface UserData {
  _id: string;
  type: 'native' | 'google';
  name: string;
  email: string;
  picture: string;
  isVerified: boolean;
  isPremium: boolean;
}

interface UserSliceState {
  accessToken: string | null;
  refreshToken: string | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const refreshTokenStorage = localStorage.getItem('refreshToken');
const userDataStorage = localStorage.getItem('userData');

const initialState: UserSliceState = {
  accessToken: null,
  refreshToken: refreshTokenStorage
    ? (JSON.parse(refreshTokenStorage) as string)
    : null,
  userData: userDataStorage ? (JSON.parse(userDataStorage) as UserData) : null,
  loading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    userSuccess: (state, { payload }: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.message = payload || null;
    },

    userFail: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.error = payload;
    },

    setRefreshToken: (
      state,
      { payload }: PayloadAction<UserSliceState['refreshToken']>
    ) => {
      state.refreshToken = payload;
    },

    setAccessToken: (
      state,
      { payload }: PayloadAction<UserSliceState['accessToken']>
    ) => {
      state.accessToken = payload;
    },

    setUserData: (
      state,
      { payload }: PayloadAction<UserSliceState['userData']>
    ) => {
      state.userData = payload;
    },

    clearResponse: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
