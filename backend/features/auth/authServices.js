import { verifyPassword } from "../../lib/encryptPassword.js";
import passwordResetMailBody from "../../util/passwordResetMailBody.js";
import sendEmail from "../../util/sendEmail.js";
import * as authRepository from "./authRepository.js";

const userSignUp = async (userData) => {

    const {username, password, email} = userData;

    const emailExists = await authRepository.findUserByEmail(email);
    const usernameExists = await authRepository.findUserByUsername(username);

    if(emailExists) {
        throw new Error("user with given email exists")
    }

    if(usernameExists) {
        throw new Error("username already taken")
    }
    
    return await authRepository.createUser(userData);
}


const userLogin = async ({email, password}) => {

    const user = await authServices.findUserByEmail(email);
    if (!user) {
        throw new Error('User with given email not found');
    }

    const isPasswordValid = await verifyPassword(password, user.password); 
    if (!isPasswordValid) {
        throw new Error('Incorrect password');
    }

    if (!user.verified) {
        throw new Error('User is not verified');
    }

    return user
}

const forgotPassword = async (email) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("User with given email not found");
    } 
    
    const resetToken = await authRepository.createToken(user.id);
    if (!resetToken) {
        throw new Error("Token not created. Try again later");
    }

    sendEmail({from: process.env.SENDER_EMAIL, to: user.email, subject: 'Password Reset', html: passwordResetMailBody(user.username, user.id, resetToken.token)});
    return { message: 'Check your email for link to reset your password'};
}


export {userSignUp, userLogin, forgotPassword};