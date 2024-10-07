import { validationResult } from 'express-validator';

import * as userService from './userService.js';

const updateUserDetails = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const {id, firstname, lastname, gender, dob, country, avatar} = req.body;
        const user = await userService.updateUserDetails(id, {firstname, lastname, gender, dob, country, avatar});

        return res.status(200).json({message: 'user updated', user: user})
    } catch (error) {
        console.error("Error in adding user details: ", error);
        return res.status(500).json({message: JSON.stringify(error.message) || 'Error in adding user details'})
    }
}

export {updateUserDetails}