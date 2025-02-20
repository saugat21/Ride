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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://ride-kappa.vercel.app"); // ✅ Replace with your Vercel URL
    res.header("Access-Control-Allow-Methods", "GET, POST,PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});
//yo chai frontend ko port ra backend ko port aarkai xa vane use garnu parxa hameley
app.use(cors({
    origin: ["https://ride-kappa.vercel.app"], 
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
}));


// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser Middleware(req.cookie use garna dinxa yesle)
app.use(cookieParser())


//route 
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingRoute)

app.get("/api/test", (req, res) => {
    res.json({ message: "CORS working!" });
});
app.get('/', (req, res) => {
    res.send("API is running...")
})



app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})