import dbClient from '../config/db';
import User from '../models/userModel'


class AppController {
    static getStatus(req, res) {
        res.status(200).json({
            db: dbClient.isAlive(),
        });
    }
     static async getStats(req, res) {
        const usersCount = await User.countDocuments();
        res.status(200).json({
            users: usersCount,
        });
    }
}

export default AppController;
