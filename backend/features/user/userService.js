import { CustomError } from '../../util/customError.js';
import * as userRepository from './userRepository.js';
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

export {updateUserDetails, getUserDetails, updateUserAvatar, getAvatarById}