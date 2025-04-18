import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../tools/apiClient';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const response = await apiClient.get('/channels');
    return response.data;
  },
);

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (name, { getState, rejectWithValue }) => {
    const { channels } = getState().channels;
    const nameExists = channels.some((ch) => ch.name === name);
    if (nameExists) {
      return rejectWithValue({ message: 'Channel name already exists' });
    }
    const response = await apiClient.post('/channels', { name });
    return response.data;
  },
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (channelId) => {
    await apiClient.delete(`/channels/${channelId}`);
    return channelId;
  },
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ channelId, newName }, { getState, rejectWithValue }) => {
    const { channels } = getState().channels;
    const nameExists = channels.some((ch) => ch.name === newName);
    if (nameExists) {
      return rejectWithValue({ message: 'Channel name already exists' });
    }
    const response = await apiClient.patch(`/channels/${channelId}`, { name: newName });
    return response.data;
  },
);

const initialState = {
  channels: [],
  currentChanelId: null,
  loading: false,
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => ({
      ...state,
      currentChanelId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => ({
        ...state,
        loading: true,
        error: null,
      }))

      .addCase(fetchChannels.fulfilled, (state, action) => {
        const updatedState = {
          ...state,
          loading: false,
          channels: action.payload,
        };

        if (!state.currentChanelId && action.payload.length > 0) {
          updatedState.currentChanelId = action.payload[0].id;
        }

        return updatedState;
      })

      .addCase(fetchChannels.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message,
      }))

      .addCase(addChannel.fulfilled, (state, action) => ({
        ...state,
        channels: [...state.channels, action.payload],
        currentChanelId: action.payload.id,
      }))

      .addCase(removeChannel.fulfilled, (state, action) => {
        const updatedChannels = state.channels.filter((ch) => ch.id !== action.payload);
        let newCurrentChannelId = state.currentChanelId;

        if (state.currentChanelId === action.payload) {
          if (updatedChannels.length > 0) {
            newCurrentChannelId = updatedChannels[0].id;
          } else {
            newCurrentChannelId = null;
          }
        }
        return {
          ...state,
          channels: updatedChannels,
          currentChanelId: newCurrentChannelId,
        };
      })

      .addCase(renameChannel.fulfilled, (state, action) => {
        const updatedChannels = state.channels.map((ch) => {
          if (ch.id === action.payload.id) {
            return action.payload;
          }
          return ch;
        });
        return {
          ...state,
          channels: updatedChannels,
        };
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
