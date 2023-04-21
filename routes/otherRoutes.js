import express from "express";

import { isAuthenticated, isAuthorizeAdmin } from "../middlewares/auth.js";
import { getStats } from "../controllers/otherControllers.js";

const router = express.Router();

router.route("/admin/stats").get(isAuthenticated,isAuthorizeAdmin,getStats);

export default router;