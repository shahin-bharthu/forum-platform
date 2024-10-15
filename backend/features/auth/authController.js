import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

import * as authServices from "./authServices.js";
import * as authRepository from "./authRepository.js"
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


const userLogin = asyncErrorHandler(async (req,res,next) => {
    try {
        const userData = req.body;
        const user = await authServices.userLogin(userData)
        
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
                // httpOnly: true,
                maxAge: 3600000,
        });
        
        return res.status(200).json({data: user, message: 'User logged in successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: JSON.stringify(error.message) || 'Error during login'})
    }
})


const verifyEmail = asyncErrorHandler(async (req, res) => {
    const { id: userId, token } = req.params;    
    try {
        const user = await authRepository.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                msg: "No user found for this verification. Please sign up.",
            });
        }        
        if (user.isVerified) {
            return res.status(200).json({
                error: false,
                msg: "User is already verified. Please log in.",
            });
        }        
        const userToken = await authRepository.findTokenByUserId(userId);
        if (!userToken || userToken.verificationToken !== token) {
            return res.status(400).json({
                error: true,
                msg: "Invalid verification link. Please request a new one.",
            });
        }        
        const currentTime = new Date();
        if (new Date(userToken.expiresAt) < currentTime) {
            return res.status(400).json({
                error: true,
                msg: "The verification link has expired. Please request a new one.",
            });
        }        
        const verificationSuccess = await authRepository.setUserVerified(userId);
        if (!verificationSuccess) {
            console.error("Failed to update user's verification status.");
            return res.status(500).json({
                error: true,
                msg: "Couldn't update user's verification status. Please try again later.",
            });
        }        
        await authRepository.deleteTokenById(userToken.id);        
        return res.redirect('http://localhost:5173/login');    
    } 
    catch (error) {
        console.error("Error during email verification:", error);
        return res.status(500).json({
            error: true,
            msg: "An internal server error occurred. Please try again later.",
        });
    }
})


const forgotPassword = asyncErrorHandler(async (req, res) => {
    try {
        const {email} = req.body;
        const message = await authServices.forgotPassword(email);
        return res.status(200).json({message});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: error.message || 'Failed to send reset password link'})
    }
})


const resetPassword = asyncErrorHandler(async (req,res) => {
    try {
        const token = req.params.token;
        const { password, confirmPassword} = req.body;

        const response = await authServices.resetPassword(token, password, confirmPassword);
        return res.status(200).json({message: response.message || 'Password has been reset!'})
    } catch (error) {
        console.error("Error while resetting password: ", error);
        return res.status(500).json({message: error.message || 'Error while resetting password'})
    } 
})


const userLogout = (req, res, next) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error during logout' });
    }
};

  
export {userSignUp, userLogin, verifyEmail, forgotPassword, resetPassword, userLogout};