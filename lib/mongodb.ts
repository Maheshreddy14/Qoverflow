import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    if (isConnected) {
        console.log('MongoDB already connected');
        return;
    }

    try {
        const mongoUrl = process.env.MONGO_DB_URL || 'your_default_connection_string';
        if (!mongoUrl) {
            console.error('Error: MONGO_DB_URL is not defined');
            return;
        }

        // MongoDB connection options
        const options = {
            dbName: 'qflow',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 50,
            minPoolSize: 5,
        };

        // Connect to the database
        await mongoose.connect(mongoUrl, options);
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        setTimeout(connectToDB, 5000); // Retry after 5 seconds
    }
};
