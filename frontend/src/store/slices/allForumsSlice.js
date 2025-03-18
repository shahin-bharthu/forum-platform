import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subscribableForums: [],
    subscribedForums: []
}

export const allForumsSlice = createSlice({
    name: 'allForums',
    initialState,
    reducers: {
        setSubscribableForums: (state, action) => {
            state.subscribableForums = action.payload;
        },
        setSubscribedForums: (state, action) => {
            state.subscribedForums = action.payload;
        }
    }
});

export const { setSubscribableForums, setSubscribedForums } = allForumsSlice.actions;

export default allForumsSlice.reducer; 