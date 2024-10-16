import { encryptPassword, verifyPassword } from "../../lib/encryptPassword.js";
import passwordResetMailBody from "../../util/passwordResetMailBody.js";
import sendEmail from "../../util/sendEmail.js";
import * as authRepository from "./authRepository.js";
import verificationMailBody from "../../util/verificationMailBody.js";
import {CustomError} from "../../util/customError.js"

const userSignUp = async (userData) => {
    const { username, email } = userData;
    
    const emailExists = await authRepository.findUserByEmail(email);
    if (emailExists) {
        throw new Error('User with given email already exists');
    }
    
    const usernameExists = await authRepository.findUserByUsername(username);
    if (usernameExists) {
        throw new Error('Username already taken');
    }
    
    const user = await authRepository.createUser(userData);
        
    const token = await authRepository.createVerificationToken(user.id);
    
    await sendEmail({
        from: 'forum@gmail.com',
        to: email,
        subject: 'Verify Your Account - Action Required',
        html: verificationMailBody(username, user.id, token.verificationToken),
    });
    
    return user;
};


const userLogin = async ({ email, password }) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('User with given email not found');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Incorrect password');
    }

    if (!user.isVerified) {
        throw new Error('User is not verified');
    }

    return user;
};


const verifyUserEmail = async (userId, token) => {    
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new CustomError("No user found for this verification. Please sign up.", 404);
    }    

    if (user.isVerified) {
        throw new CustomError("User is already verified. Please log in.", 200);
    }    

    const userToken = await authRepository.findTokenByUserId(userId);
    
    if (!userToken || userToken.verificationToken !== token) {
        throw new CustomError("Invalid verification link. Please request a new one.", 400);
    }    

    const currentTime = new Date();
    if (new Date(userToken.expiresAt) < currentTime) {
        throw new CustomError("The verification link has expired. Please request a new one.", 400);
    }    

    const verificationSuccess = await authRepository.setUserVerified(userId);
    if (!verificationSuccess) {
        console.error("Failed to update user's verification status.");
        throw new CustomError("Couldn't update user's verification status. Please try again later.", 500);
    }    

    await authRepository.deleteTokenById(userToken.id);    
    return { message: "User verified successfully." }; // Return success message
};


const forgotPassword = async (email) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("User with given email not found");
    } 
    
    const resetToken = (await authRepository.createResetToken(user.id)).resetToken;
    if (!resetToken) {
        throw new Error("Token not created. Try again later");
    }

    sendEmail({from: process.env.SENDER_EMAIL, to: user.email, subject: 'Password Reset', html: passwordResetMailBody(user.username, user.id, resetToken)});
    return { message: 'Check your email for link to reset your password'};
}

const resetPassword = async (token, password, confirmPassword) => {
    const userToken = (await authRepository.findResetToken(token));
    if (!userToken) {
        throw new Error("Reset token not found");
    }

    const user = await authRepository.findUserById(userToken.userId);
    if (!user) {
        throw new Error("No user found");
    }

    if (password !== confirmPassword) {
        return {message: 'Passwords must match'}
    }

    user.password = await encryptPassword(password);
    await user.save()
    const result = await authRepository.deleteTokenById(userToken.id);
    return {message: 'Password has been reset'}
}


export {userSignUp, userLogin, forgotPassword, resetPassword, verifyUserEmail};