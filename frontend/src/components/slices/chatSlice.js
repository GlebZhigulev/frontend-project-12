// src/components/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const channelsResponse = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messagesResponse = await axios.get('/api/v1/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
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
