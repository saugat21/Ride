import express from "express"
import { getMessage,createMessage } from "../controller/chatController.js";

const router = express.Router();

router.route('/').post(createMessage);
router.route('/:rideId').get(getMessage);



export default router;