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

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', validateRequest(loginUserSchema), loginUser);
app.post('/signup', validateRequest(createUserSchema), createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
    .then(() => {
        app.listen(PORT, () => {
          console.log(`Server starting at http://localhost:${PORT}`)
        })
    })
  .catch(err => {
      console.log('Fail connect to mongo', err);
  })

