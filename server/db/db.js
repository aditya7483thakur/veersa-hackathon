import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`Mongo Connection success ` );
    } catch (error) {
        console.log("MongoDB connection failed.", error);
        process.exit(1);
    }
}

export default connectDB;