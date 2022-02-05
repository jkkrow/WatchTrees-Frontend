import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChannelData {
  _id: string;
  name: string;
  picture: string;
  subscribers: number;
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
      { payload }: PayloadAction<UserSliceState['userData']>
    ) => {
      state.userData = payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
