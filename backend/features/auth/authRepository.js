import { Op } from 'sequelize';
import crypto from 'crypto'

import {db} from '../../config/connection.js'
import { verifyPassword, encryptPassword } from '../../lib/encryptPassword.js';

const createUser = async (userData) => {
    const hashedPassword = await encryptPassword(userData.password);
    const user = await db.User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
    });
    return user;
};

const findUserByEmail = async (email) => {
    return await db.User.findOne({ where: { email } });
};

const getUserPassword = async(email) => {
    const user = await db.User.findOne({
        where: {email}
    });

    return user.password;
}

const findUserByUsername = async (username) => {
    return await db.User.findOne({ where: { username } });
};

const findUserById = async (id) => {
    return await db.User.findByPk(id);
};

const createVerificationToken = async (id) => {
    const token = await db.Token.create({
        userId: id,
        verificationToken: crypto.randomBytes(16).toString("hex"),
    });
    return token;
};

const createResetToken = async (id) => {
    try {
        const token = await db.Token.create({
            userId: id,
            resetToken: crypto.randomBytes(16).toString("hex"),
        });
        return token;
    } catch (error) {
        console.error('Error creating token:', error);
        throw error;
    }
}

const findTokenByUserId = async (userId) => {
    return await db.Token.findOne({where: {userId}})
}

const findResetToken = async (resetToken) => {
    return await db.Token.findOne({where: {resetToken}})
}

const setUserVerified = async (userId) => {
    return await db.User.update(
        { isVerified: true },
        {
        where: {
            id: userId,
        },
        }
    );  
}

const deleteTokenById = async (tokenId) => {
    try {
        const result = await db.Token.destroy({
            where: { id: tokenId }
        });

        if (result === 0) {
            // No rows were deleted, meaning the ID was not found
            return { message: 'No token found with the provided ID' };
        }

        return { message: 'Token deleted successfully' };
    } catch (error) {
        console.error('Error deleting token:', error);
        throw new Error('Error deleting token');
    }
};

export {
    createUser, 
    findUserByEmail, 
    findUserByUsername, 
    createVerificationToken,
    createResetToken, 
    findTokenByUserId, 
    findResetToken,
    findUserById, 
    setUserVerified, 
    getUserPassword, 
    deleteTokenById
};