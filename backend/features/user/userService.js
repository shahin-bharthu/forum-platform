import * as userRepository from './userRepository.js';

const updateUserDetails = async (id, userData) => {
    return await userRepository.updateUser(id, userData);
}

export {updateUserDetails}