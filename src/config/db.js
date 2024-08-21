import mongoose from "mongoose";
import env from './env';
import process from 'process';

class DBClient {
    constructor() {
        this.connectionString = env.MONGO_URI;
        this.connect();
    }
    async connect() {
        const options = {
            // Mongoose  hass these options as defaults and some are no longer needed
        };
        try {
            await mongoose.connect(this.connectionString, options);
            // this.clearDatabase();
            console.log('Successfully connected to the database');
        } catch (error){
            console.error('Error connecting to the database', error);
            process.exit(1);
        }
    }

    // For Testing Purposes - clearing the database
    async clearDatabase() {
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            for (const collection of collections) {
                await mongoose.connection.db.dropCollection(collection.name);
            }
            console.log('Database cleared successfully');
        } catch (error) {
            console.error('Error clearing database', error);
        }
    }

    isAlive() {
        return mongoose.connection.readyState === 1;
    }
}

const dbClient = new DBClient();
export default dbClient;
