import User from '../models/userModel';
import CustomError from '../utils/customerror';

export default class UserController {
    // POST /user/create - Create User
    static async createUser(req, res, next) {
        const { name, username, password } = req.body;

        // validate input
        if (!name) return next(new CustomError(400, 'Name is missing'));
        if (!username) return next(new CustomError(400, 'username is missing'));
        if (!password) return next(new CustomError(400, 'password is missing'));

        // validate if user already exist
        const userExist = await User.findOne({ username });
        if (userExist) return next(new CustomError(400, 'user already exist'));

        // create user
        let user;
        try {
            user = await User.create({ name, username, password });
        } catch (err) {
            return next(new CustomError(500, err.message));
        }

        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
        };
        return res.status(201).json(userData);

    }

    // GET /user/retrieve/:id? - Retrieve User
    // GET /user/retrieve/:id? - Retrieve User
static async retrieveUser(req, res, next) {
    const { id } = req.params;
    const { name } = req.query;

    let users;
    try {
        if (!id && !name) {
            // If no id or name is provided, retrieve all users
            users = await User.find({});
        } else {
            // If an id or name is provided, retrieve the user with that id or name
            users = await User.find({ $or: [{ _id: id }, { name: name }] });
        }
    } catch (err) {
        return next(new CustomError(500, err.message));
    }

    if (!users.length) return next(new CustomError(404, 'User not found'));

    const usersData = users.map(user => ({
        id: user._id,
        name: user.name,
        username: user.username,
    }));

    return res.status(200).json(usersData);
}

    // PUT /user/update/:id? - Update User
    static async updateUser(req, res, next) {
        const { oldName } = req.query;
        const { newName } = req.body;
        const { id } = req.params;

        // validate input
        if (!oldName && !newName) return next(new CustomError(400, 'oldName query and newName json are missing'));
        if (!id && !newName) return next(new CustomError(400, 'id and newName json are missing'));

        // validate if oldName and newName are the same
        if (oldName === newName) return next(new CustomError(400, 'oldName and newName are the same'));

        // update user by finding user by id or oldName
        let user;
        try {
            user = await User.findOneAndUpdate({ $or: [{ _id: id }, { name: oldName }] }, { name: newName }, { new: true });
        } catch (err) {
            return next(new CustomError(500, err.message));
        }

        if (!user) return next(new CustomError(404, 'User not found'));

        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
        };
        return res.status(200).json(userData);
    }
       
    
    static async deleteUser(req, res, next) {
            const { name } = req.query;
            const { id }  = req.params;

            if (!name && !id) return next(new CustomError(400, 'name or id query is missing'));
            
            try {
                await User.findOneAndDelete({ $or: [{ _id: id }, { name: name }] });
            } catch (err) {
                return next(new CustomError(500, err.message));
            } 
            return res.status(200).json("user deleted");
    }

} 

