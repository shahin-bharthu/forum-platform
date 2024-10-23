import { validationResult } from 'express-validator';
import path from 'path';
import { promises as fs } from 'fs';

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
    const user = await userService.updateUserDetails(id, {firstname, lastname, gender, dob, country});

    return res.status(200).json({message: 'Your details have been updated!', user: user})
})


const updateUserAvatar = asyncErrorHandler(async (req,res,next) => {
    const {id} = req.params;
    const {email} =  req.body;
    const avatar = req.file?.path ?? "";
    
    const user = await userService.updateUserAvatar(id, {avatar});

    return res.status(200).json({message: 'Your avatar has been updated!', user: user})

})

// const getAvatar = asyncErrorHandler(async (req, res, next)=> {
//     const filepath = req.user.avatar.split("/");
//     const fileName = filepath[filepath.length - 1];
  
//     if(fileName === ""){
//       return res.status(404).json({
//         status: "failed",
//         message: "Avatar not found",
//       });
//     } else {
//       res.sendFile(fileName, {
//         root: path.join(__dirname, "../../avatars"),
//       });
//     }
// })


const getAvatar = asyncErrorHandler(async (req, res, next) => {
  const filepath = req.user.avatar.split('/');
  const fileName = filepath[filepath.length - 1];
  
  if (!fileName) {
    return res.status(404).json({
      status: 'failed',
      message: 'Avatar not found',
    });
  } else {
    const filePath = path.join(import.meta.url.replace('file://', ''), '../../../avatars', fileName);
    
    try {
      await fs.access(filePath); 

      res.sendFile(fileName, {
        root: path.join(new URL('../../avatars', import.meta.url).pathname),
      });
    } catch (err) {
      return res.status(404).json({
        status: 'failed',
        message: 'Avatar not found',
      });
    }
  }
});


export {updateUserDetails, getUserDetails, updateUserAvatar, getAvatar}