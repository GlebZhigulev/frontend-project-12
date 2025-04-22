// src/slices/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null, // 'add', 'rename', 'delete', 'manage'
  data: null,
};

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state, action) => ({
      ...state,
      type: action.payload.type,
      data: action.payload.data || null,
    }),
    closeModal: (state) => ({
      ...state,
      type: null,
      data: null,
    }),
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
