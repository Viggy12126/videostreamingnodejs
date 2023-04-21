import express from "express";
import {addLecture, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures} from "../controllers/courseControllers.js"
import { authorizeSubsribers, isAuthenticated, isAuthorizeAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router=express.Router();

router.route("/courses").get(getAllCourses);

router.route("/createcourse").post(isAuthenticated,isAuthorizeAdmin,singleUpload,createCourse);

router.route("/course/:id").get(isAuthenticated,authorizeSubsribers,getCourseLectures)
.post(isAuthenticated,isAuthorizeAdmin,singleUpload,addLecture)
.delete(isAuthenticated,isAuthorizeAdmin,deleteCourse);

router.route("/lecture").delete(isAuthenticated,isAuthorizeAdmin,deleteLecture);

export default router;