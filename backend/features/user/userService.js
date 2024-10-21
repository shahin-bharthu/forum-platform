import * as userRepository from './userRepository.js';

const updateUserDetails = async (id, userData) => {
    return await userRepository.updateUser(id, userData);
}

const updateUserAvatar = async (id, userData) => {
    return await userRepository.updateUserAvatar(id, userData);
}

const getUserDetails = async (id) => {
    return await userRepository.getUserById(id);
}

export {updateUserDetails, getUserDetails, updateUserAvatar}