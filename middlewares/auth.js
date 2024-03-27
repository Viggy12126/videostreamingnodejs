import  jwt  from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import { User } from "../models/User.js";

export const isAuthenticated=catchAsyncError(async(req,res,next)=>{

    const {token}=req.cookies;

    if(!token)
    return next(new ErrorHandler("Please login to access a user",401));

    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    console.log("decoded id is ",decoded._id);

    req.user=await User.findById(decoded._id);

    console.log("User is ",req.user);
    
    next();
})

export const authorizeSubsribers=(req,res,next)=>{

   
    if(req.user.subscription.status!=="active" && req.user.role!=="admin"){
        return next(new ErrorHandler(`Only subsribers can access this resource`));
    }

    next();
}

export const isAuthorizeAdmin=(req,res,next)=>{

   
    if(req.user.role!=="admin"){
        return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`));
    }

    next();
}