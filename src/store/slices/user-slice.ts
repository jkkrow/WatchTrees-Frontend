import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authActions } from './auth-slice';
import { UserData } from '../types/user';

interface UserSliceState {
  userData: UserData | null;
}

const userDataStorage = localStorage.getItem('userData');

const initialState: UserSliceState = {
  userData: userDataStorage ? (JSON.parse(userDataStorage) as UserData) : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (
      state,
      { payload }: PayloadAction<Partial<UserSliceState['userData']>>
    ) => {
      for (let key in payload) {
        (state.userData as any)[key] = (payload as any)[key];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      authActions.signin,
      (state, { payload }: PayloadAction<{ userData: UserData }>) => {
        state.userData = payload.userData;
      }
    );

    builder.addCase(authActions.signout, (state) => {
      state.userData = null;
    });

    builder.addCase(authActions.setVerified, (state) => {
      if (!state.userData) return;

      state.userData.isVerified = true;
    });
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
