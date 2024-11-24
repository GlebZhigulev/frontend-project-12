import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    channels: channelsReducer,
    messages: messagesReducer,
  },
});

export default store;