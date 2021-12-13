import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChannelData {
  _id: string;
  name: string;
  picture: string;
  subscribers: number;
  subsscribes: number;
  isSubscribed: boolean;
}

interface userSliceState {
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: userSliceState = {
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

    clearResponse: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
