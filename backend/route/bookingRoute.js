import express from "express"
import { createBooking,updateBookingAmount, getBookingById, updateBookingPayment, getRideHistoryById, getAvailableRide, updateRideStatus, getBookingDetailsById, markNotification, deleteNotification, deleteBooking } from "../controller/bookingController.js"




const router = express.Router();

router.route('/').post(createBooking);
router.route('/:bookingId/payment').put( updateBookingPayment);
router.route('/:bookingId/amount').patch( updateBookingAmount);
router.route('/history/:userId').get( getRideHistoryById);
router.route('/available-ride').get(getAvailableRide);
router.route('/rides/:bookingId/status').patch(updateRideStatus);
router.route('/:bookingId/mark-read').patch(markNotification);
router.route('/:bookingId/delete-notification').patch(deleteNotification);
router.route('/:bookingId').get( getBookingById);
router.route('/:bookingId').delete(deleteBooking);
router.route('/bookingdetails/:bookingId').get(getBookingDetailsById);


export default router;