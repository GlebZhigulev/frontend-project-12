import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import apiClient from '../tools/apiClient';

export const fetchChannels = createAsyncThunk('channels/fetchChannels', async () => {
  const response = await apiClient.get('/channels');
  return response.data;
});

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (name, { dispatch, getState, rejectWithValue }) => {
    const { channels } = getState().channels;
    // Проверка на уникальность имени
    if (channels.some((ch) => ch.name === name)) {
      return rejectWithValue({ message: 'Channel name already exists' });
    }
    const response = await apiClient.post('/channels', { name });
    dispatch(setCurrentChannel(response.data.id));
    return response.data;
  },
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId, { dispatch }) => {
    await apiClient.delete(`/channels/${channelId}`);
    // Переключаем на дефолтный канал (например, с id = 1) или на первый из списка
    dispatch(setCurrentChannel(1));
    return channelId;
  },
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ channelId, newName }, { getState, rejectWithValue }) => {
    const { channels } = getState().channels;
    if (channels.some((ch) => ch.name === newName)) {
      return rejectWithValue({ message: 'Channel name already exists' });
    }
    const response = await apiClient.patch(`/channels/${channelId}`, { name: newName });
    return response.data;
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChanelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChanelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
        if (!state.currentChanelId && action.payload.length > 0) {
          state.currentChanelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter((ch) => ch.id !== action.payload);
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex((ch) => ch.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
