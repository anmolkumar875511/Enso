import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

const connectDB = async() => {
    try {
        await mongoose.connect(URI);
        console.log("Database connected");
    } catch (error) {
        console.log('Failed to connect server', error);
        process.exit(1);
    }
};

export default connectDB;