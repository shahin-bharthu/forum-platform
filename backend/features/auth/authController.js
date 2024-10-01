import { userSignUp as userSignupService } from "./authServices.js";

const userSignUp = async (req,res,next) => {
    try {
        const {username, password, email} = req.body;
        
        //sanitization

        const userData = {
            username, 
            password, 
            email
        }

        const user = await userSignupService(userData);
        return res.json({message: 'user created', user: user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: JSON.stringify(error.message) || 'Error creating user'})
    }
}

export {userSignUp};