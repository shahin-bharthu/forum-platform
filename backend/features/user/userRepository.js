import {db} from '../../config/connection.js'

const getUserById = async (id) => {
    return await db.User.findByPk(id);
}

const updateUser = async (id, {firstname, lastname, gender, dob, country, avatar }) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.update({
            firstname,
            lastname,
            gender,
            dob,
            country,
            avatar,
        });

        await user.save();

        return { status: 'success', data: user };
    } catch (error) {
        console.log(error);
        return {status: 'failure', data: error};
    }
};

export {updateUser, getUserById}