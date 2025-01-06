import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import * as authServices from "./authServices.js";
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import { oauth2Client } from "../../util/googleClient.js";
import { db } from "../../config/connection.js";
import { downloadImage } from "../../util/downloadImage.js";
import { CustomError } from "../../util/customError.js";

const userSignUp = asyncErrorHandler(async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    const user = await authServices.userSignUp({ username, password, email });

    return res.status(201).json({ message: "We've sent you a verification link on the email you entered!" });
})


const userLogin = asyncErrorHandler(async (req, res, next) => {
    const userData = req.body;

    const user = await authServices.userLogin(userData);

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const expirationDate = new Date(Date.now() + 3600000); // Set expiration date to 1 hour from now
    
    res.cookie('token', token, {
        maxAge: 3600000,
        secure: true
    });

    res.cookie('expiration', expirationDate.toUTCString(), {
        maxAge: 3600000, 
        secure: true, 
    });

    user.password = null
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
        res.clearCookie("token", {maxAge: 0});
        res.clearCookie("expiration", {maxAge: 0});

        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || 'Error during logout' });
    }
};


const googleAuth = asyncErrorHandler (async(req, res, next) => {
    const code = req.query.code;    
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture, hd } = userRes.data;

    if (!(hd?.includes('argusoft.in') || hd?.includes('argusoft.com'))) {
        throw new CustomError("Please use an email ending with argusoft.com or argusoft.in to sign up or sign in", 403);
    }

    let user = await db.User.findOne({ where: { email } });
    if (!user) {
        const username = email.split('@')[0];
        user = await db.User.create({ username, email });

        const savePath = `./avatars/${user.id}-${username}.jpg`;
        await downloadImage(picture, savePath);

        user.avatar = `avatars/${user.id}-${username}.jpg`;
        await user.save()
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const expirationDate = new Date(Date.now() + 3600000); // Set expiration date to 1 hour from now

    res.cookie('token', token, {
        maxAge: 3600000,
        secure: true
    });

    res.cookie('expiration', expirationDate.toUTCString(), {
        maxAge: 3600000,
        secure: true,
    });

    user.password = null
    return res.status(200).json({ data: user, message: 'Logging you in' });
});


export {userSignUp, userLogin, verifyEmail, forgotPassword, resetPassword, userLogout, googleAuth};