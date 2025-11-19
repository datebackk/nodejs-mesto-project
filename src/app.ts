import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import validateRequest from './middlewares/validate';
import { createUserSchema, loginUserSchema } from './validators/user';
import { createUser, loginUser } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import errorHandler from './middlewares/errors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(requestLogger);
app.use(errorLogger);

app.use(errorHandler);

app.post('/signin', validateRequest(loginUserSchema), loginUser);
app.post('/signup', validateRequest(createUserSchema), createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter)

app.listen(3000)