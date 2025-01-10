import Booking from "../model/bookingModel.js"
import asyncHandler from "../middleware/asyncHandler.js"


// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const { name, phoneNumber, numberOfPeople, sourcePlace, destinationPlace, payment, amount } = req.body;
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const booking = new Booking({
        user: req.user._id,
        name,
        phoneNumber,
        numberOfPeople,
        sourcePlace: {
            name: sourcePlace.name,
            location: {
                type: 'Point',
                coordinates: [sourcePlace.lng, sourcePlace.lat],
            },
        },
        destinationPlace: {
            name: destinationPlace.name,
            location: {
                type: 'Point',
                coordinates: [destinationPlace.lng, destinationPlace.lat],
            },
        },
        payment,
        amount,

    });

    try {
        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update payment and amount of an existing booking
// @route   PUT /api/bookings/:id/payment
// @access  Private
const updateBookingPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { payment, amount } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { payment, amount, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc    Get booking details by ID with distance calculation
// @route   GET /api/bookings/:bookingId
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.bookingId)
        .populate('user', 'name email')
        .select('name phoneNumber numberOfPeople sourcePlace destinationPlace ');

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    const calculateDistance = (source, destination) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (destination.lat - source.lat) * Math.PI / 180;
        const dLng = (destination.lng - source.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLng / 2) +
            Math.cos(source.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const source = {
        lat: booking.sourcePlace.location.coordinates[1],
        lng: booking.sourcePlace.location.coordinates[0]
    };

    const destination = {
        lat: booking.destinationPlace.location.coordinates[1],
        lng: booking.destinationPlace.location.coordinates[0]
    };

    const distance = calculateDistance(source, destination);

    res.json({
        ...booking.toObject(),
        distance: distance.toFixed(2)
    });
});

// @desc    Get ride history for userId
// @route   GET /api/bookings/history/:userId
// @access  Private

const getRideHistoryById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
       
        const rideHistory = await Booking.find({ user: userId }).sort({ createdAt: -1 }); 

        if (!rideHistory || rideHistory.length === 0) {
            return res.status(404).json({ message: 'No ride history found for this user.' });
        }

        res.status(200).json(rideHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ride history.' });
    }
})

// @desc    Get available with payment
// @route   GET /api/bookings/availableRide
// @access  Private tara aaile private rakhako xoina yoo paxe milaune!
const getAvailableRide = asyncHandler(async (req, res) => {
    try {

        // Fetch rides with payment: true
        const rides = await Booking.find({ payment: true })
        // console.log(rides);

        if (!rides.length) {
            return res.status(404).json({ message: 'No available rides found.' });
        }


        res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching available rides:', error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
})

// @desc    update ride status
// @route   PUT /api/bookings/rides/:bookindId/status
// @access  Private
const updateRideStatus = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { status, driverName, driverPhoneNumber } = req.body;

    try {
        const updatedRide = await Booking.findByIdAndUpdate(
            bookingId,
            {
                status,
                ...(status === "Confirmed" && { driverName, driverPhoneNumber }), // Update only for "Confirmed" status
            },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(updatedRide);
    } catch (error) {
        console.error("Error updating ride status:", error);
        res.status(500).json({ message: "Failed to update status", error });
    }
});

// @desc    Get booking details with id
// @route   GET /api/bookings/bookingdetails/:bookingId
// @access  Private

const getBookingDetailsById = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


// @desc    Mark Notification as read
// @route   PATCH /api/bookings/:bookingId/mark-read
// @access  Private
const markNotification = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { "notification.isRead": true },
            { new: true }
        );
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to update notification", error });
    }
})

// @desc    Delete Notification
// @route   PATCH /api/bookings/:bookingId/delete-notification
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findByIdAndUpdate(
            bookingId, 
            { "notification.isDeleted": true },
            { new: tru }  
        );
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete notification", error });
    }
})

// @desc    Delete a booking by ID
// @route   DELETE /api/bookings/:bookingId
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking deleted successfully" });
});


export { createBooking, getBookingById, updateBookingPayment, getRideHistoryById, getAvailableRide, updateRideStatus, getBookingDetailsById, markNotification, deleteNotification,deleteBooking };