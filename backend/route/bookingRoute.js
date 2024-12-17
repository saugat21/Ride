import express from "express"
import { createBooking, getBookingById, updateBookingPayment, getRideHistoryById, getAvailableRide, updateRideStatus, getBookingDetailsById, markNotification, deleteNotification, deleteBooking } from "../controller/bookingController.js"
import protect from "../middleware/protectMiddleware.js";




const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/:bookingId/payment').put(protect, updateBookingPayment);
router.route('/history/:userId').get( getRideHistoryById);
router.route('/available-ride').get(getAvailableRide);
router.route('/rides/:bookingId/status').patch(updateRideStatus);
router.route('/:bookingId/mark-read').patch(markNotification);
router.route('/:bookingId/delete-notification').patch(deleteNotification);
router.route('/:bookingId').get(protect, getBookingById);
router.route('/:bookingId').delete(deleteBooking);
router.route('/bookingdetails/:bookingId').get(getBookingDetailsById);


export default router;