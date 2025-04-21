import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import messagesReducer from './messagesSlice';
import channelsReducer from './channelsSlice';
import modalReducer from './modalSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
});

export default store;
