import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;
export const dbConnect = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    // Check if there's an active connection and close it
    if (mongoose.connection.readyState >= 1) {
        await mongoose.connection.close();
    }
    await mongoose.connect(uri);
}

export const dbDisconnect = async () => {
    await mongoose.disconnect();
    await mongo.stop();
}
