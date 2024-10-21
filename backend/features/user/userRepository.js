import {db} from '../../config/connection.js'

const getUserById = async (id) => {
    return await db.User.findByPk(id);
}

const updateUser = async (id, {firstname, lastname, gender, dob, country, avatar }) => {
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

        return user;
};

const updateUserAvatar = async (id, { avatar }) => {
    const user = await db.User.findByPk(id);
    if (!user) {
        throw new Error('User not found');
    }
    await user.update({
        avatar,
    });

    await user.save();

    return user;
};

export {updateUser, getUserById, updateUserAvatar}