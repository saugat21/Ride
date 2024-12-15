import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'driver'],
        default: 'user'
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    driverDetails: {
        licenseNumber: {
            type: String,
            trim: true
        },
        vehicleDetails: {
            type: {
                type: String,
                trim: true
            },
            model: {
                type: String,
                trim: true
            },

        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    placeName: {
        type: String,

    },

}, { timestamps: true })

userSchema.index({ location: '2dsphere' }); 
const User = mongoose.model('User', userSchema);

export default User;