import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      // Запрос каналов
      const channelsResponse = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Запрос сообщений
      const messagesResponse = await axios.get('/api/v1/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        channels: channelsResponse.data,
        messages: messagesResponse.data,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
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
      addMessage: (state, action) => {
        if (action.payload) {
          state.messages.push(action.payload);
        } else {
          console.warn('❌ Пустое сообщение пришло в addMessage:', action);
        }
      },
      },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChatData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.channels = action.payload.channels;
                state.messages = action.payload.messages;
            })
            .addCase(fetchChatData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});
export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;