import { validationResult } from 'express-validator';

import * as userService from './userService.js';
import { asyncErrorHandler } from '../../util/asyncErrorHandler.js';

const getUserDetails = asyncErrorHandler(async (req,res,next) => {
    const id = req.params.id;
    const user = await userService.getUserDetails(id)
    return res.status(200).json({message: 'User Fetched', user: user})
})

const updateUserDetails = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const {id, firstname, lastname, gender, dob, country} = req.body;
    const avatar = req.file?.path ?? "";
    const user = await userService.updateUserDetails(id, {firstname, lastname, gender, dob, country, avatar});

    return res.status(200).json({message: 'Your details have been updated!', user: user})
})

export {updateUserDetails, getUserDetails}