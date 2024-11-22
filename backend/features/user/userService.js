import os from 'os';
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
    const osType = os.type();

    const user = await userRepository.getUserById(id);

    const pathDelimiter = osType === 'Linux' ? '/' : '\\';
    const avatarPath = user.avatar.split(pathDelimiter);
    const fileName = avatarPath.pop(); 

    if (!fileName) {
        throw new CustomError("Avatar not found", 404);
    } else {
        const basePath = import.meta.url.replace(osType === 'Linux' ? 'file://' : 'file:///', '');
        const filePath = path.join(basePath, '../../../avatars');
        await fs.access(filePath);
        const avatarPath = path.join(filePath, fileName)
        return { avatarPath }
      }
}

export {updateUserDetails, getUserDetails, updateUserAvatar, getAvatarById}