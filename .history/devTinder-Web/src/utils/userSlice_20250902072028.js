// utils/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userData: null,
  feed: null,
  connections: null,
  request: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: null,
    email: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.name = null;
      state.email = null;
      state.userData = null;
    },
    logout: () => initialState,
  },
});

export const { setUser, clearUser, logout } = userSlice.actions;
export default userSlice.reducer;
