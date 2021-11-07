import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authActions } from './auth-reducer';

export interface UserData {
  name: string;
  email: string;
  picture: string;
  isVerified: boolean;
  isPremium: boolean;
}

interface userSliceState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

const userDataJSON = localStorage.getItem('userData');

const initialState: userSliceState = {
  userData: userDataJSON ? (JSON.parse(userDataJSON) as UserData) : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    userSuccess: (state) => {
      state.loading = false;
    },

    userFail: (state, { payload }: PayloadAction<string>) => {
      state.loading = false;
      state.error = payload;
    },

    setUserData: (
      state,
      { payload }: PayloadAction<{ [key in keyof UserData]?: UserData[key] }>
    ) => {
      state.loading = false;
      if (!state.userData) {
        state.userData = payload as UserData;
      } else {
        state.userData = {
          ...state.userData,
          ...payload,
        };
      }
    },

    clearResponse: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      authActions.login,
      (
        state,
        {
          payload,
        }: PayloadAction<{
          accessToken: string;
          refreshToken: string;
          userData: UserData;
        }>
      ) => {
        state.userData = payload.userData;
      }
    );
    builder.addCase(authActions.logout, (state) => {
      state.userData = null;
    });
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
