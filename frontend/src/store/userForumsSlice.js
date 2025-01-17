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
        setPublicForums: (state, action) => {
            state.publicForums = action.payload;
        },
        setPrivateForums: (state, action) => {
            state.privateForums = action.payload;
        },
        setArchivedForums: (state, action) => {
            state.archivedForums = action.payload;
        }
    },
})

export const { setPublicForums, setPrivateForums, setArchivedForums } = userForumsSlice.actions;

export default userForumsSlice.reducer; 