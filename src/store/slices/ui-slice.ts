import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id?: string;
  content: string;
  type: 'message' | 'error';
  timer?: number;
}

interface UISliceState {
  messages: Message[];
}

const initialState: UISliceState = {
  messages: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, { payload }: PayloadAction<Message>) => {
      const newMessage = { ...payload, id: uuidv4() };
      state.messages.push(newMessage);
    },

    clearMessage: (state, { payload }: PayloadAction<Message>) => {
      state.messages = state.messages.filter(
        (message) => message.id !== payload.id
      );
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
