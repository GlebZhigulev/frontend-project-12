// src/components/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    error: null,
  },
  reducers: {
    setToken(state, action) {
      // сайд‑эффект — пишем в localStorage
      localStorage.setItem('token', action.payload);
      // возвращаем новый state
      return {
        ...state,
        token: action.payload,
      };
    },
    setUsername(state, action) {
      localStorage.setItem('username', action.payload);
      return {
        ...state,
        username: action.payload,
      };
    },
    removeToken(state) {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
      };
    },
    setError(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
  },
});

export const {
  setToken,
  setUsername,
  removeToken,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
