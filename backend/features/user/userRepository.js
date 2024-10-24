import {db} from '../../config/connection.js'
import deleteFile from '../../util/deleteFile.js';

const getUserById = async (id) => {
    return await db.User.findByPk(id);
}

const updateUser = async (id, {firstname, lastname, gender, dob, country }) => {
    console.log(id);
    
        const user = await db.User.findByPk(id);
        console.log(firstname, lastname, gender);
        
        if (!user) {
            throw new Error('User not found');
        }
        await user.update({
            firstname,
            lastname,
            gender,
            dob,
            country,
        });

        await user.save();

        return user;
};

const updateUserAvatar = async (id, { avatar }) => {
    const user = await db.User.findByPk(id);
    if (!user) {
        throw new Error('User not found');
    }
    const oldAvatarPath = user.avatar;
    await user.update({
        avatar,
    });

    await user.save();
    if (oldAvatarPath && oldAvatarPath !== 'avatars/defaultAvatar.png') {        
        deleteFile(`../${oldAvatarPath}`);
    }

    return user;
};

export {updateUser, getUserById, updateUserAvatar}