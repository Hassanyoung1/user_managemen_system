import express from 'express';
import AppController from '../controllers/AppController';

const appRouter = express.Router();

appRouter.get('/status', AppController.getStatus);
appRouter.get('/stats', AppController.getStats);


export default appRouter;
