import UserController from '../../controllers/UserController';
import User from '../../models/userModel';
import CustomError from '../../utils/customerror';
import { dbConnect, dbDisconnect } from '../memoryServer';



describe('UserController', () => {
    let res;
    let next;

    beforeAll(async () => await dbConnect());
    afterAll(async () => await dbDisconnect());

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    username: 'johndoe',
                    password: 'password',
                },
            };

            const user = {
                _id: '1',
                name: 'John Doe',
                username: 'johndoe',
            };

            User.create = jest.fn().mockResolvedValue(user);

            await UserController.createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                id: user._id,
                name: user.name,
                username: user.username,
            });
        });

        it('should return an error if name is missing', async () => {
            const req = {
                body: {
                    username: 'johndoe',
                    password: 'password',
                },
            };

            await UserController.createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'Name is missing'));
        });

        it('should return an error if username is missing', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    password: 'password',
                },
            };

            await UserController.createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'username is missing'));
        });

        it('should return an error if password is missing', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    username: 'johndoe',
                },
            };

            await UserController.createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'password is missing'));
        });

        it('should return an error if user already exist', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    username: 'johndoe',
                    password: 'password',
                },
            };

            User.findOne = jest.fn().mockResolvedValue(req.body);

            await UserController.createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'user already exist'));
        });

        it('should return an error if user creation fails', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    username: 'johndoe',
                    password: 'password',
                },
            };

            User.findOne = jest.fn().mockResolvedValue(null);
            User.create = jest.fn().mockRejectedValue(new Error('Failed to create user'));

            await UserController.createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(500, 'Failed to create user'));
        });
    });
    describe('retrieveUser', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                params: {},
                query: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        it('should retrieve all users if no id or name is provided', async () => {
            const users = [
                { _id: '1', name: 'User 1', username: 'user1' },
                { _id: '2', name: 'User 2', username: 'user2' }
            ];
            User.find = jest.fn().mockResolvedValue(users);

            await UserController.retrieveUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users.map(user => ({
                id: user._id,
                name: user.name,
                username: user.username
            })));
        });

        it('should retrieve a user by id', async () => {
            const user = { _id: '1', name: 'User 1', username: 'user1' };
            req.params.id = '1';
            User.find = jest.fn().mockResolvedValue([user]);

            await UserController.retrieveUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{
                id: user._id,
                name: user.name,
                username: user.username
            }]);
        });

        it('should retrieve a user by name', async () => {
            const user = { _id: '1', name: 'User 1', username: 'user1' };
            req.query.name = 'User 1';
            User.find = jest.fn().mockResolvedValue([user]);

            await UserController.retrieveUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{
                id: user._id,
                name: user.name,
                username: user.username
            }]);
        });

        it('should return a 404 error if no user is found', async () => {
            User.find = jest.fn().mockResolvedValue([]);

            await UserController.retrieveUser(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(CustomError));
            expect(next.mock.calls[0][0].statusCode).toBe(404);
            expect(next.mock.calls[0][0].message).toBe('User not found');
        });

        it('should return a 500 error if database operation fails', async () => {
            User.find = jest.fn().mockRejectedValue(new Error('Database error'));

            await UserController.retrieveUser(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(CustomError));
            expect(next.mock.calls[0][0].statusCode).toBe(500);
            expect(next.mock.calls[0][0].message).toBe('Database error');
        });
    });
    
    describe('updateUser', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                params: {},
                query: {},
                body: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        it('should return an error if oldName and newName are missing', async () => {
            await UserController.updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'oldName query and newName json are missing'));
        });

        it('should return an error if id and newName are missing', async () => {
            req.query.oldName = 'oldName';

            await UserController.updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'id and newName json are missing'));
        });

        it('should return an error if oldName and newName are the same', async () => {
            req.query.oldName = 'name';
            req.body.newName = 'name';

            await UserController.updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'oldName and newName are the same'));
        });

        it('should return a 404 error if no user is found', async () => {
            req.params.id = '1';
            req.body.newName = 'newName';
            User.findOneAndUpdate = jest.fn().mockResolvedValue(null);

            await UserController.updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(404, 'User not found'));
        });

        it('should return a 500 error if database operation fails', async () => {
            req.params.id = '1';
            req.body.newName = 'newName';
            User.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

            await UserController.updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(500, 'Database error'));
        });

        it('should update the user', async () => {
            const user = { _id: '1', name: 'User 1', username: 'user1' };
            req.params.id = '1';
            req.body.newName = 'newName';
            User.findOneAndUpdate = jest.fn().mockResolvedValue(user);

            await UserController.updateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: user._id,
                name: user.name,
                username: user.username
            });
        });
    });

    describe('deleteUser', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                params: {},
                query: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        it('should return an error if name and id are missing', async () => {
            await UserController.deleteUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(400, 'name or id query is missing'));
        });

        it('should return a 500 error if database operation fails', async () => {
            req.params.id = '1';
            User.findOneAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

            await UserController.deleteUser(req, res, next);

            expect(next).toHaveBeenCalledWith(new CustomError(500, 'Database error'));
        });

        it('should delete the user', async () => {
            req.params.id = '1';
            User.findOneAndDelete = jest.fn().mockResolvedValue({});

            await UserController.deleteUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith('user deleted');
        });
    });
});
