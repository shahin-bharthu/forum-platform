import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    publicForums: [],
    privateForums: [],
    archivedForums: []
}

export const userForumsSlice = createSlice({
    name: 'userForums',
    initialState,
    reducers: {
        setPostCount: (state, action) => {
            state.userPostCount = action.payload;
            state.lastUpdated = new Date().toISOString();
        }
    },
})

export const { setPostCount } = userForumsSlice.actions;

export default userForumsSlice.reducer; 