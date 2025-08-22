import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected');
    } catch (error) {
        console.log("MongoDB connection error", error.message);
    }
}

export default connectDB;