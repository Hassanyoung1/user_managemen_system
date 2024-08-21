import express from 'express';
import userRouter from './routes/userRoute.js';
import appRouter from './routes/appRoute.js';
import bodyParser from 'body-parser';
import env from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = env.PORT;

app.use(bodyParser.json());
app.use(express.json());

app.use('/', appRouter);
app.use('/user', userRouter);

// Error handling middleware
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
export default app;
