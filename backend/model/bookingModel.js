import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    numberOfPeople: {
        type: Number,
        required: true,
    },
    sourcePlace: {
        name: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                default: [0, 0], // Default coordinates (longitude, latitude)
            },
        },
    },
    destinationPlace: {
        name: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                default: [0, 0], // Default coordinates (longitude, latitude)
            },
        },
    },
    payment: {
        type: Boolean,
        default: false,
    },
    amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], // Define status options
        default: 'Pending', // Default status
    },
    driverName: { 
        type: String,
        default: null,
    },
    driverPhoneNumber: { 
        type: String,
        default: null,
    },
    notification: {
        isRead: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
}, { timestamps: true });

bookingSchema.index({ location: '2dsphere' }); // Index for geospatial queries

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;