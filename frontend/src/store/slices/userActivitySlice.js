import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isCurrentUser: false,
    userDetails: {},
    userForums: [],
    userPosts: [],
    userComments: [],
    likedPosts: [],
    // savedPosts: [],
}

const userActivitySlice = createSlice({
    name: 'userActivity',
    initialState,
    reducers: {
        setUserActivity: (state, action) => {
            if (action.payload) {
                state.isCurrentUser = action.payload.isCurrentUser;
                state.userDetails = action.payload.user;
                state.userForums = action.payload.myForums;
                state.userPosts = action.payload.myTopics;
                state.userComments = action.payload.myComments;
                state.likedPosts = action.payload.likedTopics;
            }
            // if (action.payload.profilePhoto) {
            //     state.profilePhoto = action.payload.profilePhoto;
            // }
        },
        clearUserActivity: (state) => {
            state.userName = "user"
            state.profilePhoto = null
        }
    },
})

export const { setUserActivity, clearUserActivity } = userActivitySlice.actions;

export default userActivitySlice.reducer; 