import { findUser, createUser } from "./authRepository.js";

const userSignUp = async (userData) => {

    const {username, password, email} = userData;

    const existingUser = await findUser(email, username);

    if(existingUser) {
        throw new Error("user with given email or username exists")
    }
    console.log("services");
    
    return await createUser(userData);
}

export {userSignUp};