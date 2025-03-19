import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isCurrentUser: false,
    userDetails: {},
    userForums: {publicForums: [], privateForums: [], archivedForums: []},
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
            state.isCurrentUser = false;
            state.userDetails = {};
            state.userForums = {};
            state.userPosts = [];
            state.userComments = [];
            state.likedPosts = [];        
        }
    },
})

export const { setUserActivity, clearUserActivity } = userActivitySlice.actions;

export default userActivitySlice.reducer; 