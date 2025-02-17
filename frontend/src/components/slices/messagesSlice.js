import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../tools/apiClient';

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ body, channelId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/messages', { body, channelId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
