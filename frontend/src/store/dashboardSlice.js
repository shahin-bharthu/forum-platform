import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recentForums: []
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setRecentForums: (state, action) => {
            state.recentForums = action.payload;
        }
    }
});

export const { setRecentForums } = dashboardSlice.actions;

export default dashboardSlice.reducer; 