import path from 'path';
import { promises as fs } from 'fs';
import { CustomError } from '../../util/customError.js';
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

const getAvatarById = async (id) => {
    const user = await userRepository.getUserById(id);
    const filepath = user.avatar.split('/');
    const fileName = filepath[filepath.length - 1];

    if (!fileName) {
        throw new CustomError("Avatar not found", 404);
    } else {
        const filePath = path.join(import.meta.url.replace('file://', ''), '../../../avatars', fileName);
        await fs.access(filePath);
        const root = path.join(new URL('../../avatars', import.meta.url).pathname);
        const avatarPath = path.join(root, fileName)
        return { avatarPath }
      }
}

export {updateUserDetails, getUserDetails, updateUserAvatar, getAvatarById}