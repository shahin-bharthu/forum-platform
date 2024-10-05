import { findUserByEmail, findUserByUsername, createUser } from "./authRepository.js";

const userSignUp = async (userData) => {

    const {username, password, email} = userData;

    const emailExists = await findUserByEmail(email);
    const usernameExists = await findUserByUsername(username);

    if(emailExists) {
        throw new Error("user with given email exists")
    }

    if(usernameExists) {
        throw new Error("username already taken")
    }
    
    return await createUser(userData);
}


const userLogin = async (userData) => {

    // const {email, password} = userData;

    // const emailExists = await findUserByEmail(email);
    // const usernameExists = await findUserByUsername(username);

    // if(emailExists) {
    //     throw new Error("user with given email exists")
    // }

    // if(usernameExists) {
    //     throw new Error("username already taken")
    // }
    
    // return await createUser(userData);
}


export {userSignUp, userLogin};