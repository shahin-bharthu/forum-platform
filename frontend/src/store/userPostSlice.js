import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userPostCount: 0,
    lastUpdated: null,
}

export const userPostSlice = createSlice({
    name: 'userPosts',
    initialState,
    reducers: {
        setPostCount: (state, action) => {
            state.userPostCount = action.payload;
            state.lastUpdated = new Date().toISOString();
        }
    },
})

export const { setPostCount } = userPostSlice.actions;

export default userPostSlice.reducer; 