import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

import * as authServices from "./authServices.js";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";

const userSignUp = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    const userData = { username, password, email };

    const user = await authServices.userSignUp(userData);

    return res.status(201).json({ message: "We've sent you a verification link on the email you entered!" });
})


const userLogin = asyncErrorHandler(async (req, res, next) => {
    const userData = req.body;

    const user = await authServices.userLogin(userData);

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
        maxAge: 3600000
    });

    return res.status(200).json({ data: user, message: 'User logged in successfully' });
});


const verifyEmail = asyncErrorHandler(async (req, res, next) => {
    const { id: userId, token } = req.params;

    const {message, status} = await authServices.verifyUserEmail(userId, token);
    
    return res.redirect(`http://localhost:5173/login/${status}`);
});


const forgotPassword = asyncErrorHandler(async (req, res, next) => {
    
    const {email} = req.body;
    
    const message = await authServices.forgotPassword(email);
    return res.status(200).json({ message: message || 'Sent reset password link' });
});


const resetPassword = asyncErrorHandler(async (req, res, next) => {    
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    const message = await authServices.resetPassword(token, password, confirmPassword);
    return res.status(200).json({ message: message || 'Password has been reset!' });
});



const userLogout = (req, res, next) => {
    try {
        console.log("in logout controller");
        
        // res.clearCookie('token', { path: '/' });
        // res.cookie('token', '', {
        //     expires: new Date(0), // Set to a date in the past
        //     path: '/' // Ensure this matches the path used when setting the cookie
        // });
        // res.clearCookie("token", {maxAge: 0});
        // res.setHeader('Set-Cookie', 'token=; Max-Age=0;');
        console.log("after clear cookie");

        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || 'Error during logout' });
    }
};

export {userSignUp, userLogin, verifyEmail, forgotPassword, resetPassword, userLogout};