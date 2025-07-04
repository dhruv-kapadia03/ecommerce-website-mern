import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log(`\n MongoDB connected && DB Host: ${connectionInstance.connection.host} \n`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;