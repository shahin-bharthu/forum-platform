import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // isLoading: false,
    modalOpen: false,
    notification: {
      message: null,
      type: null,
    },
    drawerOpen: false,
  }


const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleModal(state) {
      state.modalOpen = !state.modalOpen;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = { message: null, type: null };
    },
    toggleDrawer(state) {
      state.drawerOpen = !state.drawerOpen;
    },
  },
});

export const {
  toggleModal,
  setNotification,
  clearNotification,
  toggleDrawer,
} = uiSlice.actions;

export default uiSlice.reducer;
