import { validationResult } from 'express-validator';
import * as userService from './userService.js';
import { asyncErrorHandler } from '../../util/asyncErrorHandler.js';
import { getImage } from '../../util/getImage.js';

const getUserDetails = asyncErrorHandler(async (req,res,next) => {
    const id = req.params.id;
    const user = await userService.getUserDetails(id)
    return res.status(200).json({message: 'User Fetched', user: user})
})


const getCurrentUserDetails = asyncErrorHandler(async (req,res,next) => {
  return res.status(200).json({user: req.user});
})


const updateUserDetails = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const {id, firstname, lastname, gender, dob, country} = req.body;
    const user = await userService.updateUserDetails(id, {firstname, lastname, gender, dob, country});
    return res.status(200).json({message: 'Your details have been updated!', user: user})
})


const updateUserAvatar = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const avatar = req.file?.path ?? "";
    const user = await userService.updateUserAvatar(id, {avatar});
    return res.status(200).json({message: 'Your avatar has been updated!', user: user})
})


const getAvatar = asyncErrorHandler(async (req, res, next) => {
  const avatarPath = await getImage(req.user.avatar, "user");
  res.sendFile(avatarPath);
});


const getAvatarById = asyncErrorHandler (async (req,res,next) => {
  const {id} = req.params;
  const avatarPath = await userService.getAvatarById(id);  
  return res.sendFile(avatarPath)
})


const getUserProfileDetails = asyncErrorHandler (async (req,res,next) => {
  const {username} = req.params;
  const currentUser = req.user;
  const userProfileDetails = await userService.getUserProfileDetails(username, currentUser);
  return res.status(200).json({message: `Profile details for ${username}`, data: userProfileDetails});
});

export {updateUserDetails, getUserDetails, updateUserAvatar, getAvatar, getAvatarById, getCurrentUserDetails, getUserProfileDetails}