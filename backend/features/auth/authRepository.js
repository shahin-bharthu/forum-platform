import { Op } from 'sequelize';

import {db} from '../../config/connection.js'

const createUser = async (userData) => {
    try {
        const user = await db.User.create(userData);
        return {status: 'success', data: user};
    } catch (error) {
        console.log(error);
        return {status: 'failure', data: error};
    }
};

const findUser = async (email, username) => {
    const userExists = await db.User.findOne({
        where: {
            [Op.or]: [
                { email: email },
                { username: username }
            ]
        }
    });
    return userExists;
}

export {createUser, findUser};