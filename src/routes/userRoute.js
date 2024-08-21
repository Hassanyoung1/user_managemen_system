import express from 'express';
import UsersController from '../controllers/UserController';

const userRouter = express.Router();

userRouter.post('/create', UsersController.createUser);
userRouter.get('/retrieve/:id?', UsersController.retrieveUser);
userRouter.put('/update/:id?', UsersController.updateUser);
userRouter.delete('/delete/:id?', UsersController.deleteUser);

export default userRouter;
