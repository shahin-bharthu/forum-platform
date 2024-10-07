import { verifyPassword } from "../../lib/encryptPassword.js";
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

    const user = await authRepository.findUserByEmail(email);
    let hashedPassword;

    if (user) {
        hashedPassword = await authRepository.getUserPassword(user.email);
    }
    else {
        throw new Error("Incorrect email. Please try again");
    }

    const isMatch = await verifyPassword(password, hashedPassword)
    
    if (isMatch) {
        return user;
    }
    else {
        throw new Error("Incorrect password. Please try again");
    }
}


export {userSignUp, userLogin};