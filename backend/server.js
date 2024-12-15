import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./config/Db.js";


//importing routes
import userRoute from "./route/userRoute.js"
import bookingRoute from "./route/bookingRoute.js"

dotenv.config();

//connecting database
connectDB();

const app = express();

const PORT = process.env.PORT || 5000

//yo chai frontend ko port ra backend ko port aarkai xa vane use garnu parxa hameley
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser Middleware(req.cookie use garna dinxa yesle)
app.use(cookieParser())


//route 
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingRoute)

app.get('/', (req, res) => {
    res.send("API is running...")
})



app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})