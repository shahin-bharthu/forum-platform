import { CustomError } from '../../util/customError.js';
import * as userRepository from './userRepository.js';
import * as forumServices from '../forum/forumServices.js';
import * as topicServices from '../topics/topicServices.js';
import * as commentServices from '../comments/commentServices.js';
import { getImage } from '../../util/getImage.js';

const updateUserDetails = async (id, userData) => {
    const user = await userRepository.getUserById(id);

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    return await userRepository.updateUser(user, userData);
}

const updateUserAvatar = async (id, {avatar}) => {
    const user = await userRepository.getUserById(id);

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    return await userRepository.updateUserAvatar(user, {avatar});
}

const getUserDetails = async (id) => {
    const user = await userRepository.getUserById(id);

    if (!user) {
        throw new CustomError("User not found", 404);
    }
    return user;
}

const getAvatarById = async (id) => {
    const user = await userRepository.getUserById(id);    
    const avatarPath = await getImage(user.avatar, "user");    
    return avatarPath;
}

const getUserProfileDetails = async (username, currentUser) => {
    const user = await userRepository.getUserByUsername(username);

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    if (user.username === currentUser.username) {
        const [myForums, myTopics, myComments, likedTopics] = await Promise.all([
            forumServices.getMyForums(currentUser.id),
            topicServices.getMyTopicsForProfile(currentUser.id),
            commentServices.getMyComments(currentUser.id),
            topicServices.getMyLikedTopics(currentUser.id)
        ]);
        // todo: saved posts

        return {user, myForums, myTopics, myComments, likedTopics, isCurrentUser: true}
    }
    else {
        const [userForums, userTopics, userComments] = await Promise.all([
            forumServices.getForumsByCreator(user.id),
            topicServices.getTopicsByCreator(user.id),
            commentServices.getCommentsByCreator(user.id)
        ]);

        return {user, userForums, userTopics, userComments, isCurrentUser: false}
    }
}

export {updateUserDetails, getUserDetails, updateUserAvatar, getAvatarById, getUserProfileDetails}