import { Op } from 'sequelize';
import crypto from 'crypto'

import {db} from '../../config/connection.js'
import { verifyPassword, encryptPassword } from '../../lib/encryptPassword.js';

const createUser = async (userData) => {
    try {
        const hashedPassword = await encryptPassword(userData.password)
        const user = await db.User.create({username: userData.username, email: userData.email, password: hashedPassword});
        return {status: 'success', data: user.id};
    } catch (error) {
        console.log(error);
        return {status: 'failure', data: error};
    }
};

const findUserByEmail = async (email) => {
    const emailExists = await db.User.findOne({
        where: {email}
    });
    return emailExists;
}

const findUserByUsername = async (username) => {
    const emailExists = await db.User.findOne({
        where: {username}
    });
    return emailExists;
}

const findUserById = async (id) => {
    return await db.User.findByPk(id);
}

const createToken = async (id) => {
    try {
        const token = await db.Token.create({
            userId: id,
            token: crypto.randomBytes(16).toString("hex"),
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

export {createUser, findUserByEmail, findUserByUsername, createToken, findTokenByUserId, findUserById, setUserVerified};