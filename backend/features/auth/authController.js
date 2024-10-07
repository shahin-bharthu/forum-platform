import { validationResult } from "express-validator";
import * as authServices from "./authServices.js";
import * as authRepository from "./authRepository.js"
import sendEmail from "../../util/sendEmail.js";
import verificationMailBody from "../../util/verificationMailBody.js";

const userSignUp = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const {username, password, email} = req.body;

        const userData = {
            username, 
            password, 
            email
        }

        const userId = (await authServices.userSignUp(userData)).data;

        if (userId) {
            const setToken = await authRepository.createToken(userId)
      
            if (setToken) {
                if (setToken) {
                    sendEmail({
                      from: "forum@gmail.com",
                      to: `${email}`,
                      subject: "Verify Your Account - Action Required",
                      html: verificationMailBody(username, userId, setToken.token)
                    });
                  }
      
            } else {
              return res.status(500).json({ "message" : "Sorry! Token not created. Please try again later!"});
            }    

            return res.status(201).json({"message" : "We've sent you a verification link on the email you entered!"})
          } else {
            return res.json({"message" : "Sorry, we faced some problem in registering your details. Please try again."})
          }
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

const verifyEmail = async (req, res) => {
    const userId = req.params.id;
    
    try {
        const userToken = await authRepository.findTokenByUserId(userId);
        if (!userToken) {
            return res.status(400).json({
                error: true,
                msg: "Your verification link may have expired. Please click on resend for verifying your Email.",
            });
        }

        const user = await authRepository.findUserById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                msg: "We were unable to find a user for this verification. Please SignUp!",
            });
        }

        if (user.isVerified) {
            return res.status(200).json({
                error: false,
                msg: "User has already been verified. Please Login.",
            });
        }

        const updated = await authRepository.setUserVerified(userId);
        if (!updated) {
            console.error("Failed to update user's verified status.");
            return res.status(500).json({
                error: true,
                msg: "Couldn't update user's verified status. Please try again later.",
            });
        }
        
        // return res.status(200).json({
        //     error: false,
        //     msg: "Your account has been successfully verified. Login to access our services.",
        // });
        return res.redirect('http://localhost:5173/login')
    } catch (error) {
        console.error("Error during email verification:", error);
        return res.status(500).json({
            error: true,
            msg: "An internal server error occurred. Please try again later.",
        });
    }
};
  

export {userSignUp, userLogin, verifyEmail};