// src/components/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../tools/apiClient';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const channelsResponse = await apiClient.get('/channels');
      const messagesResponse = await apiClient.get('/messages');
      return {
        channels: channelsResponse.data,
        messages: messagesResponse.data,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage(state, action) {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(fetchChatData.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        channels: action.payload.channels,
        messages: action.payload.messages,
      }))
      .addCase(fetchChatData.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }));
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
