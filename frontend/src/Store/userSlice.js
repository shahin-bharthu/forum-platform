import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userName: "Your Username",
    profilePhoto: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.userName = action.payload.userName
            state.profilePhoto = action.payload.profilePhoto
        },
        clearUserProfile: (state) => {
            state.userName = "user"
            state.profilePhoto = null
        }
    },
})

export const { setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer; 