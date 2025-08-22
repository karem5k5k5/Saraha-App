import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import messageRouter from "./modules/message/message.controller.js";
import { globalErrorHandler } from './utils/error/globalErrorHandler.js';
import { globalLimiter, otpLimiter } from "./utils/rate-limiter/rateLimit.js";

function bootstrap(app, express) {
    // config dotenv
    dotenv.config()

    // config cors
    app.use(cors({
        origin: "*"
    }))

    //connect to database
    connectDB();

    // rate-limit middleware
    app.use("/auth/resend-otp", otpLimiter)
    app.use(globalLimiter)

    //global middleware to parse json request body data
    app.use(express.json());

    //global middleware to give access to media files
    app.use("/uploads", express.static("uploads"))

    //routes
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/message", messageRouter);

    //global error handling middleware
    app.use(globalErrorHandler)
}

export default bootstrap;
