import express from "express";
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, getAllUsers, getMyProfile, login, logout, register, removeFromPlaylist, updateProfile, updateprofilepicture, updateUserRole } from "../controllers/userControllers.js";
import { isAuthenticated,isAuthorizeAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";


const router=express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/changepassword").put(isAuthenticated, changePassword);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);
router.route("/uploadprofilepicture").put(isAuthenticated,singleUpload,updateprofilepicture);
router.route("/admin/users").get(isAuthenticated,isAuthorizeAdmin,getAllUsers);

router.route("/admin/user/:id").put(isAuthenticated,isAuthorizeAdmin,updateUserRole)
.delete(isAuthenticated,isAuthorizeAdmin,deleteUser);

router.route("/me").delete(isAuthenticated, deleteMyProfile);


export default router;