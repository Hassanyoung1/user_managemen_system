import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export default {
    // SERVER CONFIG
    PORT: process.env.PORT || 3000,

    //MONGO CONFIG
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/express-mongo',
}
