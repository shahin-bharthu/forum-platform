import {CustomError} from "../../util/customError.js"
import { asyncErrorHandler } from "../../util/asyncErrorHandler.js";
import { db } from "../../config/connection.js";
import jwt from 'jsonwebtoken'

export const authMiddleware = asyncErrorHandler(async (req, res, next) => {
    // 1. Read the jwtToken and check if it exists
    const {token} = req.cookies;
    let jwtToken = token;    
  
    if (!jwtToken) {
      next(new CustomError("You are not logged in!", 401));
    }
  
    // 2. Validate the jwtToken
    const decodedjwtToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
  
    // 3. Check if the vendor exists
    const user = await db.User.findByPk(decodedjwtToken.id);
  
    if (!user) {
        const error = new CustomError("User with the given credential does not exist!", 401);
        return next(error);
    }
  
    // TODO: implement isPasswordChanged
    // 4.Check if the vendor changed the password after the jwtToken was issued
    // if (await vendor.isPasswordChanged(decodedjwtToken.iat)) {
    //     const err = new CustomError("Password has been changed recently. Please login again!", 401);
    //     return next(err);
    // }
  
    // 5. Attach user details to request object
    req.user = user;
    next();
})