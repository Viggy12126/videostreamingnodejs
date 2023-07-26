import {User} from '../models/User.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendToken } from '../utils/sendToken.js';
import { Course } from '../models/Course.js';
import getDataUri from '../utils/dataUri.js';
import cloudinary from "cloudinary";
import { Stats } from "../models/Stats.js";

export const register=catchAsyncError(async(req,res,next)=>{

    const {name,email,password}=req.body;
    const file=req.file;
   
   if(!name || !email || !password)
    return next(new ErrorHandler("Please fill all the required fields",400));

    let user=await User.findOne({email});

    if(user)
    return next(new ErrorHandler("User already exists",409));

    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
   
    user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:  mycloud.public_id,
            url: mycloud.secure_url,
        }

    })
   

  sendToken(res,user,"User created successfully",200);

})

export const login=catchAsyncError(async(req,res,next)=>{

    const {email,password}=req.body;

    if( !email || !password)
    return next(new ErrorHandler("Please fill all the required fields",400));

   const user=await User.findOne({email}).select("+password");

   
  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect Email or Password", 401));
   

    sendToken(res, user, `Welcome back, ${user.name}`, 200);

})



export const logout = catchAsyncError(async (req, res, next) => {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  });

  export const getMyProfile=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user._id);
  
    res.status(200).json({
      success:true,
      user
    })
    
  })

  export const changePassword=catchAsyncError(async(req,res,next)=>{

    const {oldPassword,newPassword}=req.body;

    if(!oldPassword || !newPassword)
    return next(new ErrorHandler("Please fill all the required fields",400));

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if(!isMatch)
    return next(new ErrorHandler("Please enter correct password",401));

    user.password=newPassword;

    await user.save();

    res.status(200).json({
      success:true,
      message:"Password Updated Successfully"
    })


  })

  export const updateProfile=catchAsyncError(async(req,res,next)=>{

    const {email,name}=req.body;

    const user = await User.findById(req.user._id);

    if(name)
    user.name=name;

    if(email)
    user.email=email;


    await user.save();

    res.status(200).json({
      success:true,
      message:"Profile Updated Successfully"
    })


  })


  export const addToPlaylist=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user._id);

    if(!user)
    return next(new ErrorHandler("User Not Found",400));

    const course=await Course.findById(req.body.id);

    if(!course)
    return next(new ErrorHandler("Course Not Found",401));

    const isItemExist=user.playlist.find((item)=>{
      if(item.course.toString()===course._id.toString())
      return true;
    })

    if(isItemExist)
    return next(new ErrorHandler("Playlist has been added already",409));

    user.playlist.push({
      course:course._id,
      poster:course.poster.url
    })

    await user.save();

    res.status(200).json({
      message:"Added to playlist successfully",
      user
    })


  })

  export const removeFromPlaylist=catchAsyncError(async(req,res,next)=>{


    const user=await User.findById(req.user._id);

    if(!user)
    return next(new ErrorHandler("User Not Found",400));

    const course=await Course.findById(req.query.id);

    if(!course)
    return next(new ErrorHandler("Course Not Found",401));

    const newPlaylist=user.playlist.filter((item)=>{
      if(item.course.toString()!==course._id.toString())
      return item;
    })

    user.playlist=newPlaylist;

    await user.save();

    res.status(200).json({
      success:true,
      message:"Removed from playlist successfully"
    })

  })

  export const updateprofilepicture = catchAsyncError(async (req, res, next) => {
    const file = req.file;
  
    const user = await User.findById(req.user._id);
   
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  
    user.avatar = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Profile Picture Updated Successfully",
    });
  });

export const getAllUsers=catchAsyncError(async (req, res, next) => {
      
  
  const users=await User.find({});

  res.status(200).json({
    success:true,
    users
  })

  });

  

  export const updateUserRole=catchAsyncError(async (req, res, next) => {
      
    const user=await User.findById(req.params.id);

    if(!user)
    return next(new ErrorHandler("User Not Found",401));

    if(user.role==="admin")
    user.role="user";
    else 
    user.role="admin"
  
    await user.save();

    res.status(200).json({
      success:true,
      message:"User role updated successfully"
    })
  
    });

    export const deleteUser=catchAsyncError(async (req, res, next) => {
      
      const user=await User.findById(req.params.id);
  
      if(!user)
      return next(new ErrorHandler("User Not Found",401));
  
     await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      await user.remove();
    
    res.status(200).json({
        success:true,
        message:"User deleted successfully"
      })
    
      });


      export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);
      
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      
        // Cancel Subscription
      
        await user.remove();
      
        res
          .status(200)
          .cookie("token", null, {
            expires: new Date(Date.now()),
          })
          .json({
            success: true,
            message: "User Deleted Successfully",
          });
      });

      User.watch().on("change",async ()=>{

        const stats=await Stats.find({}).sort({createdAt: "desc"}).limit(1);
      const subscription=await User.find({"subscription.status":"active"});

    stats[0].users=await User.countDocuments();
    stats[0].subscription=subscription.length;
    stats[0].createdAt=new Date(Date.now());

    await stats[0].save();
      })


