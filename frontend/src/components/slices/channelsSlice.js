// src/components/slices/channelsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../tools/apiClient';

let setCurrentChannel;

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const res = await apiClient.get('/channels');
    return res.data;
  },
);

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (name, { dispatch, getState, rejectWithValue }) => {
    const { channels } = getState().channels;
    if (channels.some((ch) => ch.name === name)) {
      return rejectWithValue({ message: 'Channel name already exists' });
    }
    const res = await apiClient.post('/channels', { name });
    dispatch(setCurrentChannel(res.data.id));
    return res.data;
  },
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId, { dispatch }) => {
    await apiClient.delete(`/channels/${channelId}`);
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
    const res = await apiClient.patch(`/channels/${channelId}`, { name: newName });
    return res.data;
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
    setCurrentChannel(state, action) {
      return {
        ...state,
        currentChanelId: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(fetchChannels.fulfilled, (state, action) => {
        const next = {
          ...state,
          loading: false,
          channels: action.payload,
        };
        if (!state.currentChanelId && action.payload.length > 0) {
          next.currentChanelId = action.payload[0].id;
        }
        return next;
      })
      .addCase(fetchChannels.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message,
      }))
      .addCase(addChannel.fulfilled, (state, action) => ({
        ...state,
        channels: [...state.channels, action.payload],
      }))
      .addCase(removeChannel.fulfilled, (state, action) => ({
        ...state,
        channels: state.channels.filter((ch) => ch.id !== action.payload),
      }))
      .addCase(renameChannel.fulfilled, (state, action) => ({
        ...state,
        channels: state.channels.map((ch) =>
          ch.id === action.payload.id ? action.payload : ch
        ),
      }));
  },
});

// присваиваем реальную функцию в объявленный выше let
setCurrentChannel = channelsSlice.actions.setCurrentChannel;
export { setCurrentChannel };

export default channelsSlice.reducer;
