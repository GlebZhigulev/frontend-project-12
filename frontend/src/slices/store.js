import { configureStore } from '@reduxjs/toolkit';

import messagesReducer from './messagesSlice';
import channelsReducer from './channelsSlice';
import modalReducer from './modalSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
});

export default store;
