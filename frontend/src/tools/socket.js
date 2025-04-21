// src/socket.js
import { io } from 'socket.io-client';
import { addMessage } from '../slices/messagesSlice';

const socket = io();

const setupSocket = (store) => {
  socket.on('disconnect', () => {
    setTimeout(() => {
      socket.connect();
    }, 3000);
  });

  socket.on('newMessage', (payload) => {
    const state = store.getState();
    const isDuplicate = state.messages.messages.some((msg) => msg.id === payload.id);
    if (!isDuplicate) {
      store.dispatch(addMessage(payload));
    }
  });
};

export { socket, setupSocket };
