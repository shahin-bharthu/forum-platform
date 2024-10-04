import {db} from '../../config/connection.js'

const updateUser = async (id, {firstname, lastname, gender, dob, country, avatar }) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return { status: 'failure', message: 'User not found' };
        }
        await user.update({
            firstname,
            lastname,
            gender,
            dob,
            country,
            avatar,
        });

        return { status: 'success', data: user };
    } catch (error) {
        console.log(error);
        return {status: 'failure', data: error};
    }
};

export {updateUser}