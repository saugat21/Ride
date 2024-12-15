import express from "express"
import { registerUsers, loginUsers, logoutUser, userLocation } from "../controller/userController.js";


const router = express.Router();

router.route('/').post(registerUsers);
router.route('/login').post(loginUsers);
router.route('/logout').post(logoutUser);
router.route('/update-location').post(userLocation)


export default router;