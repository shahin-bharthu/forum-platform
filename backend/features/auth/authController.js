import * as authServices from "./authServices.js";

const userSignUp = async (req,res,next) => {
    try {
        const {username, password, email} = req.body;

        const userData = {
            username, 
            password, 
            email
        }

        const user = await authServices.userSignUp(userData);
        return res.status(200).json({message: 'user created', user: user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: JSON.stringify(error.message) || 'Error creating user'})
    }
}

const userLogin = async (req,res,next) => {
    try {
        const {email, password} = req.body;

        const userData = {email, password}

        const user = await userSignupService(userData);
        return res.json({message: 'user created', user: user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: JSON.stringify(error.message) || 'Error creating user'})
    }
}

export {userSignUp, userLogin};