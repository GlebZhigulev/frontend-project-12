import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
    'chat/fetchChatData',
    async (_, { getState, rejectWithValue }) => {
      try {
        const token = getState().auth.token;
        const response = await axios.get('/api/v1/data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
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
      state.messages.push(action.payload);
    },},
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