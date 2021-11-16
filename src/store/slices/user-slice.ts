import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      state.error = null;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
