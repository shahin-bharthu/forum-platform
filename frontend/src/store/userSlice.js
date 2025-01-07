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
            
            if (action.payload.userName) {
                state.userName = action.payload.userName;
            }
            if (action.payload.profilePhoto) {
                state.profilePhoto = action.payload.profilePhoto;
            }
        },
        clearUserProfile: (state) => {
            state.userName = "user"
            state.profilePhoto = null
        }
    },
})

export const { setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer; 