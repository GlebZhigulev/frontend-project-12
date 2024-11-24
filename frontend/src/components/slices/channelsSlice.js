import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../tools/apiClient';

export const fetchChannels = createAsyncThunk('channels/fetchChannels', async () => {
    const response = await apiClient.get('/channels');
    return response.data; 
});

const channelsSlice = createSlice({
    name:'channels',
    initialState: {
        channels: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchChannels.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchChannels.fulfilled, (state, action) => {
            state.loading = false;
            state.channels = action.payload;
        })
        .addCase(fetchChannels.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default channelsSlice.reducer;

