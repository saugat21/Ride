import User from "../model/userModel.js"
import bcrypt from "bcryptjs";
import asyncHandler from "../middleware/asyncHandler.js"
import generateToken from "../utils/generateToken.js"

//@desc register user
//@route POST /api/users
//@access Public
const registerUsers = asyncHandler(async (req, res) => {
    const { name, email, password, role, licenseNumber, vehicleDetails,phoneNumber } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // password lai hash garako hameley
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        phoneNumber,
        driverDetails: role === 'driver' ? { licenseNumber, vehicleDetails } : undefined
    });
    
    if(user){
        // Generate token and set it as a cookie
        generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
        });
    }else{
        res.status(400);
        throw new Error('invalid user data!')
    } 
})

//@desc Login user
//@route POST /api/users/login
//@access Public
const loginUsers = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate token and set it as a cookie
        generateToken(res, user._id);
        res.json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location,
            phoneNumber: user.phoneNumber,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

//@desc Logout user and clear cookie
//@route Post /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

//@desc updating user location i.e Lat and Lon
//@route Post /api/users/update-location
//@access private
const userLocation = asyncHandler(async (req, res) => {
    const { userId, latitude, longitude, placeName } = req.body;
    try {
        // Update user's location
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                'location.type': 'Point',
                'location.coordinates': [longitude, latitude],
                placeName: placeName
            }
        }, { new: true, select: '-password' });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user location:', error);
        res.status(500).json({ error: 'Failed to update user location' });
    }

})


export { registerUsers, loginUsers, logoutUser, userLocation }