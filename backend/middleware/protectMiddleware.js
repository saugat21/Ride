import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../model/userModel.js';

const protect = asyncHandler(async (req, res, next) => {

    let token;

    //Read the jwt from the cookie
    // token = req.cookies.jwt;

    // Read the JWT token from the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract token after 'Bearer'
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {

            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }


    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export default protect;