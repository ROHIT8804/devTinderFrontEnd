import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
    name: 'feed',
    initialState:{
        feedData: null,
    },
    reducers: {
        setFeed: (state, action) => {
            state.feedData = action.payload;
        },
        clearFeed: (state) => {
            state.feedData = null;
        },
    },
})

export const { setFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;