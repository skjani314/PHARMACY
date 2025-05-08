import mongoose from 'mongoose';

const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log("Error connecting to DB:", error);
    }
};


export default ConnectDb;