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
        throw new CustomError('User is not verified');
    }

    return user;
};


const verifyUserEmail = async (userId, token) => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        return { message: "No user found for this verification. Please sign up.", status: 100 };
        // throw new CustomError("No user found for this verification. Please sign up.", 404);
    }    

    if (user.isVerified) {
        return { message: "User is already verified. Please log in.", status: 101 };
        // throw new CustomError("User is already verified. Please log in.", 200);
    }

    const userToken = await authRepository.findTokenByUserId(userId);

    if (!userToken || userToken.verificationToken !== token) {
        return { message: "Invalid verification link. Please request a new one.", status: 102 };
        // throw new CustomError("Invalid verification link. Please request a new one.", 400);
    }    

    const currentTime = new Date();
    if (new Date(userToken.expiresAt) < currentTime) {
        return { message: "The verification link has expired. Please request a new one.", status: 103 };
        // throw new CustomError("The verification link has expired. Please request a new one.", 400);
    }    

    const verificationSuccess = await authRepository.setUserVerified(userId);
    if (!verificationSuccess) {
        console.error("Failed to update user's verification status.");
        return { message: "Couldn't update user's verification status. Please try again later.", status: 104 };
        // throw new CustomError("Couldn't update user's verification status. Please try again later.", 500);
    }    

    await authRepository.deleteTokenById(userToken.id);    
    return { message: "User verified successfully.", status: 200 }; // Return success message
};


const forgotPassword = async (email) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new CustomError("User with given email not found", 404);
    } 
    
    const resetToken = (await authRepository.createResetToken(user.id)).resetToken;
    if (!resetToken) {
        throw new CustomError("Token not created. Try again later");
    }

    sendEmail({from: process.env.SENDER_EMAIL, to: user.email, subject: 'Password Reset', html: passwordResetMailBody(user.username, user.id, resetToken)});

    return 'Check your email for a link to reset your password';
};


const resetPassword = async (token, password, confirmPassword) => {
    const userToken = await authRepository.findResetToken(token);
    if (!userToken) {
        throw new CustomError("This reset password link is now invalid. Please request a new one!", 404);
    }

    const user = await authRepository.findUserById(userToken.userId);
    if (!user) {
        throw new CustomError("No user found", 404);
    }

    if (password !== confirmPassword) {
        throw new CustomError('Passwords must match', 400);
    }

    user.password = await encryptPassword(password);
    await user.save();
    await authRepository.deleteTokenById(userToken.id);

    return 'Password has been reset';
};



export {userSignUp, userLogin, forgotPassword, resetPassword, verifyUserEmail};